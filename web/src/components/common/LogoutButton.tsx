import { Button, ButtonProps } from 'antd';
import { signOut } from 'aws-amplify/auth';
import { useTranslation } from "react-i18next";

function Logout(props: ButtonProps) {
  const { t } = useTranslation();


  const handleLogout = () => {
    signOut();
    location.reload();
  }
  return (
    <Button onClick={handleLogout} type="text" size="large" {...props}>
      {t('logOut')}
    </Button>
  )
}

export default Logout
