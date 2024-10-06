import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';
import { useCookies } from 'react-cookie';
import { Radio } from 'antd';
import { pathNames } from 'src/config/constants.ts';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AdminRoleSwitch = () => {
  const { t } = useTranslation();

  const { isShowRoleSwitcher } = useCurrentUser()
  const [cookies, setCookies] = useCookies(['role']);
  const location = useLocation();
  const navigate = useNavigate();
  const switchRole = async (role: "agronomist" | "admin") => {
    if (RegExp(`${pathNames.MAP_VIEW}/.*`).test(location.pathname)) {
      navigate(pathNames.MAP_VIEW);
    }
    setCookies('role', role, { path: '/' });
  };

  return isShowRoleSwitcher &&
        <Radio.Group style={{ whiteSpace: "nowrap" }}
            options={[{ label: t("Admin"), value: "admin" }, { label: t('Agronomist'), value: "agronomist" }]}
            defaultValue={cookies.role}
            onChange={({ target: { value: role } }) => switchRole(role)}
            size='large'
            optionType={"button"}/> ;
};
