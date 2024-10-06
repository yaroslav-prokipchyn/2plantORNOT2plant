import { User } from 'src/types/Users.ts';
import { CATEGORY_KEYS } from 'src/config/constants.ts';

export type OrganizationWithAdmins = Organization & {
  admins: User[]
}

export type Organization = {
  id: string,
  name: string;
  phone: string;
  address: string;
  locked: boolean,
  lockedAt: string;
  categories: CategoryWithKey[]
}

export type Category = {
  name: string,
  allowedOptions: string[],
}

export type CategoryWithKey = Category & {
  key: CATEGORY_KEYS
}

export type OrganizationWithAdmin = Organization & Pick<User, 'firstName' | 'lastName' | 'email'>

