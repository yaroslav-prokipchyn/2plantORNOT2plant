import { t } from 'i18next'

export  const getDaysAgoLabel = (value?: string | number)=> {
    if(value === null || value === undefined) {
      return'-'
    }

    return t('day ago', { count: +value })
  }
