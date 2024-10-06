import { Button, Flex, Typography } from 'antd';
import { getDateInFormat } from 'src/helpers/dateFormat';
import { Field, FieldDetails } from 'src/types/Fields.ts';
import { getUserFullName } from 'src/helpers/getUserFullName.ts';
import { useModal } from 'src/components/common/hooks/useModal.ts';
import FieldInfoRow from 'src/pages/map-view/field-parameters/FieldInfoRow.tsx';
import CategoryTag from 'src/pages/map-view/categories/CategoryTag.tsx';
import EditFieldModal from 'src/pages/map-view/EditFieldModal.tsx';
import {
  DateStatusBadge,
  FieldStatusBadge,
} from 'src/pages/map-view/field-parameters/fiels-status-badge/StatusBadge.tsx';
import OrganizationStatusTag from 'src/pages/list-view/OrganizationStatusTag.tsx';
import { pathNames } from 'src/config/constants.ts';
import { useNavigate } from 'react-router';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { useTranslation } from 'react-i18next';

type FieldParametersProps = Field & {
  handleEdit: (field: FieldDetails) => void
  isLoading: boolean
}

function AdminFieldInfo({ handleEdit, isLoading, ...field }: FieldParametersProps) {
  const isHistoryOpened = false;
  const [isModalOpen, showModal, hideModal] = useModal(false);
  const navigate = useNavigate();
  const { isCurrentOrganizationLocked } = useCurrentOrganization();
  const { t } = useTranslation(); // Added useTranslation hook

  return (
    <div className="map-bottom-menu--main-info admin">
      {!isHistoryOpened && (
        <Flex gap={'32px'} vertical>
          <Flex vertical gap="small" className="field-info-data--header-wraper">
            <FieldStatusBadge field={field} />
            <FieldInfoRow loading={isLoading} showLoading>
              <OrganizationStatusTag locked={isCurrentOrganizationLocked} />
              <Typography.Title level={3}>{field.name ?? '-'}</Typography.Title>
            </FieldInfoRow>
          </Flex>
          <Flex className="field-info-data">
            <FieldInfoRow loading={isLoading} showLoading className="field-info__row field-categories">
              {field.categories.map((category) => (
                <CategoryTag
                  key={category.key}
                  categoryKey={category.key}
                  label={`${category.name}: ${category.allowedOptions[0]} `}
                />
              ))}
            </FieldInfoRow>
          </Flex>
          <Flex className="field-info-data">
            <div className="field-info-data--titles">
              <FieldInfoRow>{t('Agronomist')}: </FieldInfoRow>
              <FieldInfoRow>{t('Crop type')}: </FieldInfoRow>
              <FieldInfoRow>{t('Planting date')}: </FieldInfoRow>
            </div>
            <div>
              <FieldInfoRow loading={isLoading} showLoading={true}>
                {field.agronomist ? getUserFullName(field.agronomist) : '-'}
              </FieldInfoRow>
              <FieldInfoRow loading={isLoading} showLoading={true}>
                {field.crop ? t(field.crop.id) : '-'}
              </FieldInfoRow>
              <FieldInfoRow loading={isLoading} showLoading={true}>
                {field.plantedAt ? getDateInFormat(field.plantedAt) : '-'}
                {field.plantedAt && <DateStatusBadge date={field.plantedAt} tooltip />}
              </FieldInfoRow>
            </div>
          </Flex>
          <Flex className="field-info-data--buttons-warper">
            <Button
              className="field-info-button field-info-button--analitics "
              size="large"
              type="primary"
              onClick={() => navigate(`${pathNames.MAP_VIEW}/${field.id}/${field.organization.id}`)}
              disabled={!isCurrentOrganizationLocked}
            >
              {t('Analytics')}
            </Button>
            <Button className="field-info-button" size="large" type="default" onClick={showModal}>
              {t('Edit')}
            </Button>
          </Flex>
          <EditFieldModal
            field={field}
            isModalOpen={isModalOpen}
            hideModal={hideModal}
            onSubmit={handleEdit}
          />
        </Flex>
      )}
    </div>
  );
}

export default AdminFieldInfo;
