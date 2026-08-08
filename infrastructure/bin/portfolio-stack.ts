import * as cdk from "aws-cdk-lib";
import { PortfolioStack } from "../lib/portfolio-stack";

// 🚀 Entrypoint requerido por cdk.json ("app": "pnpm exec tsx bin/portfolio-stack.ts").
// La definición real del stack vive en lib/portfolio-stack.ts — aquí solo se
// instancia, para no volver a tener dos copias que se desincronicen.
const app = new cdk.App();

new PortfolioStack(app, "PortfolioStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();