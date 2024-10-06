import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {ManagedPolicy, OpenIdConnectProvider, Role, WebIdentityPrincipal} from "aws-cdk-lib/aws-iam";

export class GithubIdentityProviderStack extends cdk.Stack {
    constructor(
        scope: Construct,
        id: string,
        props?: GitHubStackProps
    ) {
        super(scope, id, props);

        const ghProvider = new OpenIdConnectProvider(this, 'githubProvider', {
            url: 'https://token.actions.githubusercontent.com',
            clientIds: ['sts.amazonaws.com'],
        });

        const policyForCdkToCreateResource = ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess');
        new Role(this, 'GitHubDeployRole', {
            assumedBy: new WebIdentityPrincipal(ghProvider.openIdConnectProviderArn, {
                StringLike: {
                    'token.actions.githubusercontent.com:sub': props?.repositoryConfig.map(r => `repo:${r.owner}/${r.repo}:${r.filter ?? '*'}`),
                },
            }),
            managedPolicies: [policyForCdkToCreateResource],
            description: 'This role is used via GitHub Actions to deploy with AWS CDK or on the target AWS account',
        });
    }
}

export interface GitHubStackProps extends cdk.StackProps {
    readonly repositoryConfig: { owner: string; repo: string; filter?: string }[];
}
