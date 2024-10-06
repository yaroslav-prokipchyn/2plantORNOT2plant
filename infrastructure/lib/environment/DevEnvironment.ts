import { IEnvironment } from "./IEnvironment";
import { template as invitationTemplate } from "../emailTemplates/devUserInvitationEmailTemplate.html";
import { template as verificationTemplate } from "../emailTemplates/devUserVerification.html";

export class DevEnvironment implements IEnvironment {
    environmentName = 'dev';
    accountId = '804050381141'
    region = 'us-east-1';
    templateName = 'dev';
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
    apiEnvs = {
        SPRING_PROFILES_ACTIVE: 'dev',
    }
    defaultUserEmails = [
        'val@naveanalytics.com',
        'anton.nazaruk@vitechteam.com',
        'bohdan.sava@vitechteam.com',
        'yaroslav.prokipchyn@gmail.com',
        'oksana.mardak@vitechteam.com',
        'oleksandra.makhova@vitechteam.com',
        'sofiia.zahoruiko@vitechteam.com',
        'taras.seman@vitechteam.com',
        'viktor.vakhramieiev@vitechteam.com',
        'yaroslav.prokipchyn@vitechteam.com',
        'bradley@naveanalytics.com',
        'ben@sparrow.dev',
    ]
    sesEmail = "no-reply@nave-app.com";
    invitationEmailTemplatePath = () => invitationTemplate;
    verificationEmailTemplatePath = () => verificationTemplate;
}
