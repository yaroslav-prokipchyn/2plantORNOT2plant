import { ConfigProvider } from 'antd';
import { translations } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Auth from 'src/pages/auth/Auth';
import theme from 'src/theme/theme';
import '@aws-amplify/ui-react/styles.css';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { supportedLngs } from 'src/i18n/config.ts';
import { I18n as amplifyi18n } from 'aws-amplify/utils';
import { useEffect } from "react";

amplifyi18n.putVocabularies(translations);

const queryClient = new QueryClient();

export default function App() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    amplifyi18n.setLanguage(( i18n.resolvedLanguage ?? i18n.language ?? navigator.language ));
    amplifyi18n.putVocabulariesForLanguage(( i18n.resolvedLanguage ?? i18n.language ?? navigator.language ), {
      'Reset Password': t('Reset Password'),
      'Enter your Password': t('Enter your Password'),
      'Username': t('Email label in loginPage'),
      'Enter your Username': t('Enter your Email placeholder in loginPage'),
      'Family Name': t('Family Name'),
      'Given Name': t('Given Name'),
      'Confirm Password': t('Confirm Password'),
      'Please confirm your Password': t('Please confirm your Password'),
      'Enter your Family Name': t('Enter your Family Name'),
      'Enter your Given Name': t('Enter your Given Name'),
    });
  }, [t, i18n]);

  if (dayjs.locale() !== supportedLngs[i18n.resolvedLanguage ?? i18n.language].daysLocale) {
    dayjs.locale(supportedLngs[i18n.resolvedLanguage ?? i18n.language].daysLocale)
  }
  return (
    <ConfigProvider theme={theme} locale={supportedLngs[i18n.resolvedLanguage ?? i18n.language].antLocale}>
        <QueryClientProvider client={queryClient}>
          <Auth />
        </QueryClientProvider>
    </ConfigProvider>
  )
}
