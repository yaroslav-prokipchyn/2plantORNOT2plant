import { Button, Card, Flex, Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { OrganizationWithAdmins } from 'src/types/Organizations.ts';
import CardItem from 'src/pages/super-admin/mobile/CardItem.tsx';
import MobileHeader from 'src/pages/super-admin/mobile/MobileHeader.tsx';
import { mapOrganizationAdmin } from 'src/pages/super-admin/mapOrganizationAdmin.ts';
import { getUserFullName } from 'src/helpers/getUserFullName.ts';

import '../super-admin.css'
import { useTranslation } from "react-i18next";

type OrganizationsMobileProps = {
  organizations: OrganizationWithAdmins[]
  handleAddOrganization: () => void
  handleDeleteOrganization: () => void
  handleEditOrganization: (id: string) => void
}
const SuperAdminDashboardMobile = ({
  organizations,
  handleAddOrganization,
  handleDeleteOrganization,
  handleEditOrganization
}: OrganizationsMobileProps) => {
  const { t } = useTranslation()

  return (
    <Flex vertical style={{ marginBottom: 24 }}>
      <MobileHeader onAddBtnClick={handleAddOrganization} />
      <Flex vertical gap={24}>
        {organizations.map((organization) => (
          <Card
            key={organization.id}
            type="inner"
            bordered={true}
            title={organization.name}
            style={{ width: 342 }}
            extra={
              <Space size="middle">
                <Tooltip title={t('Edit')}>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditOrganization(organization.id)} />
                </Tooltip>
                <Tooltip title={t('Delete')}>
                  <Button
                    disabled
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteOrganization} />
                </Tooltip>
              </Space>
            }
          >
            <CardItem variant="title" bordered> {t('Phone number')}: </CardItem>
            <CardItem variant="text" bordered> {organization.phone}</CardItem>
            <CardItem variant="title"> {t('Address')}: </CardItem>
            <CardItem variant="text"> {organization.address}</CardItem>
            <CardItem variant="title"> {t('Administrator assignment')}: </CardItem>
            <CardItem variant="text"> {mapOrganizationAdmin(organization, getUserFullName)} </CardItem>
            <CardItem variant="title"> {t('Administrator email')}: </CardItem>
            <CardItem variant="text"> {mapOrganizationAdmin(organization, u => u.email)}</CardItem>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
}

export default SuperAdminDashboardMobile;
