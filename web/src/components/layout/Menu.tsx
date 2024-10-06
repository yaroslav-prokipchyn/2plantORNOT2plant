import { useLocation, useNavigate } from 'react-router-dom';
import { Menu as AntdMenu, MenuProps } from 'antd';
import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';
import { pathNames } from 'src/config/constants.ts';
import { useTranslation } from 'react-i18next';

type MenuItem = {
  label: string;
  key: string;
}

const Menu = (props: MenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useCurrentUser();
  const { t } = useTranslation();


  const AGRONOMIST_MENU_ITEMS: MenuItem[] = [
    { label: t('Map view'), key: pathNames.MAP_VIEW },
    { label: t('List view'), key: pathNames.LIST_VIEW },
  ];

  const ADMIN_MENU_ITEMS: MenuItem[] = [
    ...AGRONOMIST_MENU_ITEMS,
  ];


  const menuItemsByRole = isAdmin ? ADMIN_MENU_ITEMS : AGRONOMIST_MENU_ITEMS

  const selectedKey = ADMIN_MENU_ITEMS.find(item => location.pathname.startsWith(item.key))?.key || ''

  return (
    <AntdMenu
      mode="horizontal"
      disabledOverflow={true}
      items={menuItemsByRole}
      onClick={(item) => navigate(item.key)}
      selectedKeys={[selectedKey]}
      {...props}
    />
  );
};

export default Menu;
