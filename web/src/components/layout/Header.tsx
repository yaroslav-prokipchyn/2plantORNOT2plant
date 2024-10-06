import { useLocation } from 'react-router-dom';
import { Flex, Layout } from 'antd';
import { useMediaQuery } from '@uidotdev/usehooks';

import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { pathNames } from 'src/config/constants.ts';
import Menu from 'src/components/layout/Menu.tsx';
import MobileHeaderWithMenu from 'src/components/layout/mobile/MobileHeaderLayout.tsx';
import { FieldUploadDialog } from 'src/pages/map-view/FieldUploadDialog';

import { AdminRoleSwitch } from 'src/components/AdminRoleSwitch.tsx';
import { ManageAgronomists } from 'src/components/layout/mobile/ManageAgronomists.tsx';

import './header.css'
import ProfileDropdown from '../profile-dropdown/ProfileDropdown';


const { Header: LayoutHeader } = Layout;

const Header = () => {
  const location = useLocation()
  const { isAdmin, isShowRoleSwitcher } = useCurrentUser()
  const { isCurrentOrganizationLocked } = useCurrentOrganization()
  const isMobileDevice = useMediaQuery('only screen and (max-width : 925px)');
  if (location.pathname === pathNames.AGRONOMISTS) return

  return (
    isMobileDevice ? (
      <MobileHeaderWithMenu />
    ) : (
      <LayoutHeader className='header-layout'>
        <Flex align={"center"} justify={isShowRoleSwitcher ? "space-between" : "right"}>
          <AdminRoleSwitch />
          <Flex align="center" justify={"space-between"}>
            {isAdmin && !isCurrentOrganizationLocked && <FieldUploadDialog />}
            <Menu />
            {isAdmin && <ManageAgronomists />}
            <ProfileDropdown />
          </Flex>
        </Flex>
      </LayoutHeader>
    )
  );
};

export default Header;
