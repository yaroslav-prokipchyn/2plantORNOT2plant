import { Button, Flex, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

type MobileHeaderProps = {
  onAddBtnClick: () => void
}
const MobileHeader = ({ onAddBtnClick }: MobileHeaderProps) => {
  const { t } = useTranslation();
  return (
    <Flex
      className="super_admin-mobile__header"
      align="center"
      justify="space-between">
      <Typography.Title level={3}>{t('Nave Analytics')}</Typography.Title>
      <Button
        type="primary"
        onClick={onAddBtnClick}
        icon={<PlusOutlined />}
        size="large" />
    </Flex>
  );
};

export default MobileHeader;
