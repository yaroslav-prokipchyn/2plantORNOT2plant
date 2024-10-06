import { CategoryWithKey } from 'src/types/Organizations.ts';
import { CATEGORY_KEYS } from 'src/config/constants.ts';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type OrganizationCategories = Record<string, any>

export const mapSuperAdminCategoriesToPayload = (categories: OrganizationCategories): CategoryWithKey[] => {
  return Object.entries(categories).reduce((acc, [key, value]) => {
    return key.includes('allowedOptions') || !value ? acc : [...acc, {
      name: value,
      allowedOptions: categories[`${key}:allowedOptions`],
      key: key as CATEGORY_KEYS,
    }]
  }, [] as CategoryWithKey[])
}

export const mapSuperAdminCategoriesToFormValue = (values: CategoryWithKey[]) => {
  return Object.entries(values).reduce((acc, [, value]) => {
    return {
      ...acc,
      [value['key']]: value['name'],
      [`${[value['key']]}:allowedOptions`]: value['allowedOptions']
    }
  }, {})
}