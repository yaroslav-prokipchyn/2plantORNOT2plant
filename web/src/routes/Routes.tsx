import { BrowserRouter as Router, Navigate, Route, Routes as ReactRoutes, } from 'react-router-dom';
import { Layout, Spin } from 'antd';

import Header from 'src/components/layout/Header';
import SuperAdminDashboard from 'src/pages/super-admin/SuperAdminDashboard.tsx';
import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';
import { pathNames } from 'src/config/constants.ts';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import Analytics from 'src/analytics/Analytics';
import store from 'src/analytics/store.ts';
import { Provider } from 'react-redux';
import Agronomists from 'src/pages/agronomists/Agronomists.tsx';
import UnitProvider from 'src/context/UnitContext';
import MapView from 'src/pages/map-view/MapView.tsx';
import ListView from 'src/pages/list-view/ListView.tsx';


const { Content } = Layout;

function Routes() {
  const { user, isSuperAdmin } = useCurrentUser()

  if (!user) return <Spin fullscreen size="large" />

  return isSuperAdmin
    ? <SuperAdminRoutes />
    : <AppRoutes />
}

function SuperAdminRoutes() {
  return (
    <Router>
      <Content>
        <ReactRoutes>
          <Route path={pathNames.SUPER_ADMIN} element={<SuperAdminDashboard />} />
          <Route path="*" element={<Navigate to={pathNames.SUPER_ADMIN} />} />
        </ReactRoutes>
      </Content>
    </Router>
  )
}

function AppRoutes() {
  const { currentOrganization } = useCurrentOrganization()
  if (!currentOrganization) return <Spin fullscreen size="large" />

  return (
    <Router>
      <Layout>
        <Provider store={store}>
          <UnitProvider>
            <Header />
            <Content>
              <ReactRoutes>
                <Route path={pathNames.MAP_VIEW} element={<MapView />} />
                <Route path={`${pathNames.MAP_VIEW}/:id`} element={<MapView />} />
                <Route path={`${pathNames.MAP_VIEW}/:id/:orgId`} element={<Analytics />} />
                <Route path={pathNames.LIST_VIEW} element={<ListView />} />
                {/*<Route path={pathNames.SETTINGS} element={<Settings />} />*/}
                <Route path={pathNames.AGRONOMISTS} element={<Agronomists />} />
                <Route path="*" element={<Navigate to={pathNames.MAP_VIEW} />} />
              </ReactRoutes>
            </Content>
          </UnitProvider>
        </Provider>
      </Layout>
    </Router>
  )
}

export default Routes;
