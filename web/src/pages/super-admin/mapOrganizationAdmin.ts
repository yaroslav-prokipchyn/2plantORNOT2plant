import type * as React from 'react';
import { OrganizationWithAdmins } from 'src/types/Organizations.ts';
import { User } from 'src/types/Users.ts';
import { t } from 'i18next';

export const mapOrganizationAdmin = (org: OrganizationWithAdmins, render: (u: User) => React.ReactNode) => {
  const user = org.admins.length ? org.admins[0] : undefined
  if (!user) return t('Unassigned')
  return render(user)
}
