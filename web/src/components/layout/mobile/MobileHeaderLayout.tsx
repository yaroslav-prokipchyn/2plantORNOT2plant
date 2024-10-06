import React, { PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, Flex, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Menu from 'src/components/layout/Menu.tsx';
import { MenuInfo } from 'rc-menu/lib/interface';

import './mobile.css'
import { AdminRoleSwitch } from 'src/components/AdminRoleSwitch.tsx';
import { FieldUploadDialog } from 'src/pages/map-view/FieldUploadDialog.tsx';
import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { ManageAgronomists } from 'src/components/layout/mobile/ManageAgronomists.tsx';
import { LanguageSwitch } from 'src/i18n/LanguageSwith.tsx';
import { UnitSwitch } from 'src/components/UnitSwitch';

const MobileHeaderWithMenu: React.FC<PropsWithChildren> = () => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>();
  const navigate = useNavigate();
  const { isAdmin } = useCurrentUser()
  const { isCurrentOrganizationLocked } = useCurrentOrganization()

  const showMenu = () => setMenuIsOpen(true);

  const onClose = () => setMenuIsOpen(false);

  const handleNavigate = (item: MenuInfo) => {
    navigate(item.key)
    onClose()
  }

  return (
    <Space className="mobile__header">
      <Flex align="center" className="mobile__header-icons">
        <Button size="large" icon={<MenuOutlined />} onClick={showMenu} />
      </Flex>
      <Drawer
        className="mobile__drawer"
        open={menuIsOpen}
        width={284}
        zIndex={1000000}
        placement="left"
        onClose={onClose}
      >
        <Space className="full-width" direction="vertical" size="large">
       
          <AdminRoleSwitch />
          <LanguageSwitch />
          <UnitSwitch size='large' />

         
          <Menu className="mobile__menu" mode="vertical" onClick={handleNavigate} />
          {isAdmin && <ManageAgronomists />}
          {isAdmin && !isCurrentOrganizationLocked && <FieldUploadDialog className="full-width" />}
        </Space>
      </Drawer>
    </Space>
  );
};

export default MobileHeaderWithMenu;
