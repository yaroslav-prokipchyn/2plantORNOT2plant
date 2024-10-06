export interface IEnvironment {
    /**
     * Name of the CloudFormation environment
     */
    environmentName: string;

    /**
     * I'd of the AWS account this environment should be deployed to
     */
    readonly accountId: string;

    /**
     * AWS region this environment should be deployed to
     */
    readonly region: string;

    /**
     * unique URL-friendly name of the environment. Could be used for tagging the resources or in DNS
     */
    readonly templateName: string;

    /**
     *  specifies the domain of the environment (e.g. immediate.co, rapidwage.com)
     */
    readonly domainName: string;

    /**
     * specifies the subdomain of the environment if app root will be not in domain root
     */
    readonly subDomain?: string;

    /**
     * specifies the hosted zone id of the environment
     */
    readonly hostedZoneId: string;

    /**
     * specifies the ARN of the certificate that should be used for this environment
     */
    readonly certificateArn: string;

    /**
     * specifies the memory limit for the api service
     */
    readonly apiMemoryLimitMiB: number;

    /**
     * specifies the CPU limit for the api service
     */
    readonly apiCpu: number;

    /**
     * specifies the memory limit for the web service
     */
    readonly webMemoryLimitMiB: number;

    /**
     * specifies the CPU limit for the web service
     */
    readonly webCpu: number;

    /**
     * specifies the api environments
     */
    readonly apiEnvs: Record<string, string>;

    readonly vizEnvs: Record<string, string>;

    readonly vizCpu: number;

    readonly vizMemoryLimitMiB: number;

    /**
     * specifies default users for cognito
     */
    readonly defaultUserEmails: string[];

    /**
     * specifies the email for SES
     */
    readonly sesEmail?: string

    /**
     * specifies the email template for cognito
     */
    readonly invitationEmailTemplatePath: () => string;

    readonly verificationEmailTemplatePath: () => string;
}
