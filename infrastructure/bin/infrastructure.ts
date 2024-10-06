#!/usr/bin/env node
import 'source-map-support/register';
import {NaveAppStack} from '../lib/stack/nave-app-stack';
import {GithubIdentityProviderStack} from "../lib/stack/github-identity-provider-stack";
import {App, Tags} from "aws-cdk-lib";

const app = new App();

const githubProviderStackName = "github-oidc-provider-stack";

Tags.of(app).add('creator', 'CDK');

const bundlingStacks = app.node.tryGetContext("aws:cdk:bundling-stacks") as Array<string>;
const buildAllStacks = bundlingStacks.includes("**");

if (buildAllStacks || !bundlingStacks.includes(githubProviderStackName)) {
    const naveAppStack = new NaveAppStack(
        app
    );
}

const githubOidcProviderStack = new GithubIdentityProviderStack(app, githubProviderStackName, {
    repositoryConfig: [{owner: 'naveanalytics-vitech', repo:'nave-app'}],
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

export {app};
