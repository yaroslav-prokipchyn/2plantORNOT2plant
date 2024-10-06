import { useTranslation } from "react-i18next";
import { supportedLngs } from "src/i18n/config.ts";
import { Select } from 'antd';

export const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  return <Select
    size='large'
    style={{ width: '100%' }}
    value={i18n.resolvedLanguage}
    onChange={(ln: string) => i18n.changeLanguage(ln)}
    getPopupContainer={(trigger) => trigger.parentElement}
    options={Object.entries(supportedLngs)
      .filter(([value]) => value.length === 5 )
      .map(([value, { name: label }]) => ({ label , value }))}
    labelRender={({ value }) => {
      return supportedLngs?.[value]?.name ?? value
    }}
 />
}
