import { CategoryWithKey } from 'src/types/Organizations.ts';
import { CATEGORY_KEYS } from 'src/config/constants.ts';
import { CategoryForm } from 'src/pages/map-view/categories/CategoriesSelect.tsx';

export const mapFieldCategoriesToPayload = (categories: CategoryForm): CategoryWithKey[] =>
  Object.entries(categories).reduce((acc, [name, value]) => {
    const [key, allowedOption] = String(value).split(':')
    return value ? [...acc, {
      name,
      key: key as CATEGORY_KEYS,
      allowedOptions: [allowedOption]
    }] : acc
  }, [] as CategoryWithKey[])

export const mapFieldCategoriesToFormValue = (categories: CategoryWithKey[]) =>
  categories.reduce((acc, { name, allowedOptions, key }) => ({
    ...acc,
    [name]: `${key}:${allowedOptions[0]}`
  }), {})
