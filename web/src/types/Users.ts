import { Organization } from 'src/types/Organizations.ts';

export type User = UserDetails & {
  id: number,
  active: boolean,
  deleted: boolean,
}

export type UserDetails = {
  firstName: string,
  lastName: string,
  email: string,
  roles: Roles[],
  organizationId: Organization['id'],
}

export enum Roles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  AGRONOMIST = 'agronomist'
}
