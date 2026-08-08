import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as targets from "aws-cdk-lib/aws-route53-targets";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🎯 Dominio
    const domainName = "brayanroa.com";
    const siteDomain = domainName;

    // ⚠️ SOLO LECTURA. `fromLookup` busca una Hosted Zone que YA existe en la
    // cuenta de AWS — CDK jamás la crea ni la destruye desde este stack.
    // No reemplazar esto por `new route53.HostedZone(...)`: eso sí crearía
    // (y en un `cdk destroy` futuro, borraría) una zona nueva, obligando a
    // re-delegar los NS en el registrador del dominio.
    const zone = route53.HostedZone.fromLookup(this, "PortfolioZone", {
      domainName,
    });

    // Certificado SSL con validación DNS automática contra esa zona
    const certificate = new acm.Certificate(this, "PortfolioCertificate", {
      domainName: siteDomain,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    // Bucket S3 privado para los archivos estáticos generados por el build
    const siteBucket = new s3.Bucket(this, "PortfolioSiteBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // CloudFront Distribution optimizada para SPA (TanStack Router)
    const distribution = new cloudfront.Distribution(this, "PortfolioCDN", {
      certificate,
      domainNames: [siteDomain],
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      // Vital para TanStack Router: si recargas en una ruta como /cv,
      // CloudFront redirige a index.html y el router maneja la navegación.
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    // Registro "A" en Route 53 apuntando el dominio a CloudFront
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone,
    });

    // 👇 Debe coincidir EXACTAMENTE con lo que genera `bun run build`.
    // El workflow ya valida esto con `ls -la .output/public` antes de llegar aquí.
    new s3deploy.BucketDeployment(this, "DeployPortfolioWebsite", {
      sources: [s3deploy.Source.asset("../.output/public")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Outputs
    new cdk.CfnOutput(this, "PortfolioCustomUrl", {
      value: `https://${siteDomain}`,
      description: "URL oficial del Portfolio",
    });

    new cdk.CfnOutput(this, "PortfolioCloudFrontUrl", {
      value: distribution.domainName,
      description: "URL de CloudFront en crudo",
    });
  }
}