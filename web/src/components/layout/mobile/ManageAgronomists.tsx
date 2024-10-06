import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { pathNames } from 'src/config/constants.ts';
import { useTranslation } from "react-i18next";

export function ManageAgronomists() {
  const navigate = useNavigate();
  const { t } = useTranslation();


  return (
    <Button
      className="button__manage-agronomists"
      onClick={() => navigate(pathNames.AGRONOMISTS)}
      type="text"
      size="large"
    >
      {t('manageAgronomists')}
    </Button>
  )
}
