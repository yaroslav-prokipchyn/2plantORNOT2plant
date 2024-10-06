import { IEnvironment } from "../environment/IEnvironment";

export class EnvironmentUtils {
  public static createName(name: string, environment: IEnvironment): string {
    return `${environment.environmentName}-${name}`;
  }

  public static getEnvironmentUri(environment: IEnvironment): string {
    switch (environment.environmentName) {
      case 'prod':
        return environment.subDomain ? `${environment.subDomain}.${environment.domainName}` : environment.domainName;
      default:
        return environment.subDomain ? `${environment.environmentName}.${environment.subDomain}.${environment.domainName}` : `${environment.environmentName}.${environment.domainName}`;
    }
  }

  public static getCertificateDomainSettings(environment: IEnvironment) {
    return {
      domainName:                       environment.subDomain ? `${environment.subDomain}.${environment.domainName}` : environment.domainName,
      subjectAlternativeNames: ['*.' + (environment.subDomain ? `${environment.subDomain}.${environment.domainName}` : environment.domainName)]
    };
  }

  public static getUserPoolDomainName(env: IEnvironment) {
    return env.environmentName == 'prod' ? `auth.${EnvironmentUtils.getEnvironmentUri(env)}`
      : `auth-${EnvironmentUtils.getEnvironmentUri(env)}`;
  }
}
