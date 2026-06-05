import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export class PortfolioStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // 🎯 0. Configuración de tu Dominio
        const domainName = 'brayanroa.com'; // 👈 Asegúrate de que este sea tu dominio exacto
        const siteDomain = domainName; // Si quieres usar www, sería `www.${domainName}`

        // 🎯 1. Buscar la Zona Hospedada en Route 53 (Debes tenerla creada manualmente en la consola de AWS)
        const zone = route53.HostedZone.fromLookup(this, 'PortfolioZone', {
            domainName: domainName,
        });

        // 🎯 2. Crear el Certificado SSL con validación DNS automática
        const certificate = new acm.Certificate(this, 'PortfolioCertificate', {
            domainName: siteDomain,
            validation: acm.CertificateValidation.fromDns(zone),
        });

        // 1. Bucket S3 para los estáticos (súper barato y rápido)
        const staticAssetsBucket = new s3.Bucket(this, 'PortfolioStaticBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });

        // 2. Lambda con Next.js Standalone + AWS Web Adapter Layer
        const nextJsLambda = new lambda.Function(this, 'PortfolioServer', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'run.sh', 
            code: lambda.Code.fromAsset('../.next/standalone'), 
            memorySize: 1536, // Subimos un poco la memoria para evitar timeouts en el arranque en frío
            timeout: cdk.Duration.seconds(30), // Le damos más margen de tiempo de arranque
            environment: {
                AWS_LAMBDA_EXEC_WRAPPER: '/opt/bootstrap', 
                PORT: '8080',
                HOSTNAME: '0.0.0.0', // 👈 VITAL para que Next.js escuche el tráfico del Web Adapter
                GROQ_API_KEY: process.env.GROQ_API_KEY || '',
                ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
            },
        });

        // Capa oficial de AWS para correr servidores Node/Express/Next en Lambda
        nextJsLambda.addLayers(
            lambda.LayerVersion.fromLayerVersionArn(
                this,
                'WebAdapterLayer',
                `arn:aws:lambda:${this.region}:753240598075:layer:LambdaAdapterLayerX86:23`
            )
        );

        // Function URL (Reemplaza a API Gateway y es GRATIS)
        const lambdaUrl = nextJsLambda.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
        });

        // 3. CloudFront Distribution (Unifica el dominio y maneja caché para SEO)
        const distribution = new cloudfront.Distribution(this, 'PortfolioCDN', {
            certificate: certificate,             // 👈 Añadimos el certificado
            domainNames: [siteDomain],            // 👈 Enlazamos el dominio
            defaultBehavior: {
                // Todo el tráfico dinámico va al Lambda URL
                origin: new origins.HttpOrigin(cdk.Fn.parseDomainName(lambdaUrl.url)),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            },
            additionalBehaviors: {
                // Los assets estáticos van a S3 con caché agresivo (1 año)
                '/_next/static/*': {
                    origin: new origins.S3Origin(staticAssetsBucket),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
                    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                },
                '/public/*': {
                    origin: new origins.S3Origin(staticAssetsBucket),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
                    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                }
            }
        });

        // 🎯 4. Crear el registro "A" en Route 53 para apuntar el dominio a CloudFront
        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone
        });

        // 5. Despliegue automático de los archivos de código de Next.js (_next/static)
        new s3deploy.BucketDeployment(this, 'DeployNextStaticFiles', {
            sources: [s3deploy.Source.asset('../.next/static')],
            destinationBucket: staticAssetsBucket,
            destinationKeyPrefix: '_next/static',
            distribution,
            distributionPaths: ['/*'], // 👈 Forzamos limpiar TODO el sitio para borrar el 500 cacheado
        });

        // 6. Despliegue automático de la carpeta public (favicon, imágenes estáticas)
        new s3deploy.BucketDeployment(this, 'DeployPublicFiles', {
            sources: [s3deploy.Source.asset('../public')],
            destinationBucket: staticAssetsBucket,
            destinationKeyPrefix: 'public', // Alineado con tu behavior '/public/*' en CloudFront
            distribution,
            distributionPaths: ['/public/*'], // Solo invalida esta ruta
        });

        // Output para saber qué URL visitar al terminar
        new cdk.CfnOutput(this, 'PortfolioCustomUrl', {
            value: `https://${siteDomain}`,
            description: 'URL oficial del Portfolio',
        });

        new cdk.CfnOutput(this, 'PortfolioCloudFrontUrl', {
            value: distribution.domainName,
            description: 'URL de CloudFront en crudo',
        });
    }
}