import { App as AntdApp } from 'antd';
import CurrentUserProvider from 'src/context/CurrentUserContext.tsx';
import Routes from 'src/routes/Routes';
import CurrentOrganizationProvider from 'src/context/CurrentOrganizationContext.tsx';

import '@aws-amplify/ui-react/styles.css';
import './auth.css';

export default function Auth() {

  return <>
      <AntdApp>
        <CurrentUserProvider>
          <CurrentOrganizationProvider>
            <Routes />
          </CurrentOrganizationProvider>
        </CurrentUserProvider>
      </AntdApp>
  </>
}
