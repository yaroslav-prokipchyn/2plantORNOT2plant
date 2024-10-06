import { IEnvironment } from "./IEnvironment";
import { template as invitationTemplate } from "../emailTemplates/prodUserInvitationEmailTemplate.html";
import { template as verificationTemplate } from "../emailTemplates/prodUserVerification.html";

export class ProdEnvironment implements IEnvironment {
    environmentName = 'prod';
    accountId = '804050381141'
    region = 'us-east-1';
    templateName = 'prod';
    domainName = 'nave-app.com';
    subDomain = undefined;
    hostedZoneId = 'Z03389573C7FZYC08JM0L';
    certificateArn = 'arn:aws:acm:us-east-1:804050381141:certificate/0d5172ce-bbb4-4748-84dd-ac943914903c';
    apiMemoryLimitMiB = 1024;
    apiCpu = 256;
    webMemoryLimitMiB = 512;
    webCpu = 256;
    vizMemoryLimitMiB = 512;
    vizCpu = 256;
    vizEnvs = {};
    apiEnvs = {}
    defaultUserEmails = [
        'val@naveanalytics.com',
        'oksana.mardak@vitechteam.com',
        'yaroslav.prokipchyn@vitechteam.com',
        'bradley@naveanalytics.com',
    ]
    sesEmail = "no-reply@nave-app.com";
    invitationEmailTemplatePath = () => invitationTemplate;
    verificationEmailTemplatePath = () => verificationTemplate;
}
