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

    const wwwDomain = `www.${domainName}`;

    // Certificado SSL con validación DNS automática contra esa zona.
    // Incluye www.brayanroa.com como SAN para que el mismo certificado
    // cubra ambos hostnames.
    const certificate = new acm.Certificate(this, "PortfolioCertificate", {
      domainName: siteDomain,
      subjectAlternativeNames: [wwwDomain],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    // Bucket S3 privado para los archivos estáticos generados por el build
    const siteBucket = new s3.Bucket(this, "PortfolioSiteBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Cada ruta se prerenderiza como carpeta: /servicios -> servicios/index.html.
    // S3 no resuelve eso solo, así que esta función reescribe la URL antes de
    // llegar al bucket. Sin esto, /servicios devolvía el HTML de la portada y
    // Google veía el título y canonical del inicio en todas las páginas.
    const rewriteFn = new cloudfront.Function(this, "PrettyUrlsFunction", {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
  } else if (uri.lastIndexOf(".") <= uri.lastIndexOf("/")) {
    request.uri = uri + "/index.html";
  }
  return request;
}`),
    });

    const distribution = new cloudfront.Distribution(this, "PortfolioCDN", {
      certificate,
      domainNames: [siteDomain, wwwDomain],
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          { function: rewriteFn, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      // Rutas que no existen: se sirve la app (que muestra su página 404)
      // pero con estado HTTP 404, para que Google no las indexe como páginas reales.
      // El bucket es privado (OAC), así que un archivo inexistente llega como 403.
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(60),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(60),
        },
      ],
    });

    // Registro "A" en Route 53 apuntando el dominio raíz a CloudFront
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone,
    });

    // Mismo alias para www — sirve el mismo contenido, no es un redirect.
    // Si más adelante prefieres que www redirija al dominio raíz (o viceversa)
    // en vez de servir el mismo contenido en ambos, se puede armar con un
    // CloudFront Function; por ahora ambos hostnames muestran el mismo sitio.
    new route53.ARecord(this, "WwwAliasRecord", {
      recordName: wwwDomain,
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