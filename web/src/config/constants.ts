export const pathNames = {
  SUPER_ADMIN: '/super-admin',
  MAP_VIEW: '/map-view',
  LIST_VIEW: '/list-view',
  SETTINGS: '/settings',
  AGRONOMISTS: '/agronomists'
}

export enum CROPS {
  CEREAL = 'cereal',
  BEETS = 'beets',
  COTTON = 'cotton',
  CORN = 'corn',
  SOYBEAN = 'soybean',
  POTATOES = 'potatoes',
}

export enum CATEGORY_KEYS {
  category_1 = 'category_1',
  category_2 = 'category_2',
  category_3 = 'category_3',
  category_4 = 'category_4',
  category_5 = 'category_5',
}

export const CATEGORY_COLORS: Record<string, string> = {
  [CATEGORY_KEYS.category_1]: '#1677FF',
  [CATEGORY_KEYS.category_2]: '#13C2C2',
  [CATEGORY_KEYS.category_3]: '#52C41A',
  [CATEGORY_KEYS.category_4]: '#FA541C',
  [CATEGORY_KEYS.category_5]: '#FAAD14',
};
