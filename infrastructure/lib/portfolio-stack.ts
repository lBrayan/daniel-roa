import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export class PortfolioStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // 🎯 0. Configuración de tu Dominio
        const domainName = 'brayanroa.com';
        const siteDomain = domainName;

        // 🎯 1. Buscar la Zona Hospedada en Route 53
        const zone = route53.HostedZone.fromLookup(this, 'PortfolioZone', {
            domainName: domainName,
        });

        // 🎯 2. Crear el Certificado SSL con validación DNS automática
        const certificate = new acm.Certificate(this, 'PortfolioCertificate', {
            domainName: siteDomain,
            validation: acm.CertificateValidation.fromDns(zone),
        });

        // 1. Bucket S3 para alojar los archivos estáticos compilados por Vite
        const siteBucket = new s3.Bucket(this, 'PortfolioSiteBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });

        // 2. CloudFront Distribution optimizada para SPA (Vite + TanStack Router)
        const distribution = new cloudfront.Distribution(this, 'PortfolioCDN', {
            certificate: certificate,
            domainNames: [siteDomain],
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
            },
            // 💡 Vital para SPAs: Si recargas en una ruta como /cv, CloudFront redirige a index.html 
            // para que TanStack Router maneje la navegación del cliente sin dar error 404.
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
            ],
        });

        // 🎯 3. Crear el registro "A" en Route 53 para apuntar el dominio a CloudFront
        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone
        });

        // 4. Despliegue automático de la carpeta 'dist' generada por Vite hacia S3
        new s3deploy.BucketDeployment(this, 'DeployViteWebsite', {
            sources: [s3deploy.Source.asset('../dist')],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'], // Limpia la caché de CloudFront al actualizar
        });

        // Outputs
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