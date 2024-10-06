import { Button, Flex, Tooltip, Typography } from 'antd';

import FieldInfoRow from 'src/pages/map-view/field-parameters/FieldInfoRow.tsx';
import { getDateInFormat } from 'src/helpers/dateFormat';
import { Field } from 'src/types/Fields.ts';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { pathNames } from 'src/config/constants.ts';
import { useNavigate } from 'react-router';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { useTranslation } from 'react-i18next'; // Added useTranslation hook

function AgronomistFieldInfo(field: Field) {
  const navigate = useNavigate();
  const { isCurrentOrganizationLocked } = useCurrentOrganization();
  const { t } = useTranslation();

  if (!field) return null;

  return (
    <div className="map-bottom-menu--main-info">
      <Flex vertical gap={'32px'}>
        <FieldInfoRow showLoading={true} loading={!field}>
          <Flex gap={'8px'}>
            {!isCurrentOrganizationLocked && (
              <Tooltip
                overlayStyle={{ minWidth: 'max-content' }}
                arrow={{ pointAtCenter: true }}
                placement="topLeft"
                color="black"
                zIndex={100000}
                title={t('The field parameters are not available yet')}
              >
                <ExclamationCircleOutlined className="field-info-data__exclamation exclamation-icon"/>
              </Tooltip>
            )}
            <Flex>
              <Typography.Title level={3}>{field.name ?? t('No name')}</Typography.Title>
            </Flex>
          </Flex>
        </FieldInfoRow>
        {isCurrentOrganizationLocked && (
          <Flex className="field-info-data">
            <div className="field-info-data--titles">
            </div>
            <div>

            </div>
          </Flex>
        )}

        <Flex className="field-info-data">
          <div className="field-info-data--titles">
            <FieldInfoRow> {t('Crop type')}: </FieldInfoRow>
            <FieldInfoRow> {t('Planting date')}: </FieldInfoRow>
          </div>
          <div>
            <FieldInfoRow showLoading={true} loading={!field}>
              {field.crop ? t(field.crop.id) : t('Not assigned')}
            </FieldInfoRow>
            <FieldInfoRow showLoading={true} loading={!field}>
              {field.plantedAt ? getDateInFormat(field.plantedAt) : t('Not assigned')}
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
        </Flex>
      </Flex>
    </div>
  );
}

export default AgronomistFieldInfo;
