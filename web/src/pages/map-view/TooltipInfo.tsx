import { Tooltip } from 'react-leaflet';
import { Typography } from 'antd';
import { Field } from 'src/types/Fields.ts';
import { getDateInFormat } from 'src/helpers/dateFormat';
import { getUserFullName } from 'src/helpers/getUserFullName.ts';
import { FieldStatusBadge } from 'src/pages/map-view/field-parameters/fiels-status-badge/StatusBadge.tsx';
import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';
import { useTranslation } from 'react-i18next';

const TooltipInfo = ({ field }: { field: Field }) => {
  const { isAgronomist } = useCurrentUser();
  const { t } = useTranslation();

  return (
    <Tooltip className="popup__field-info" direction="top" offset={[2, -24]} opacity={1}>
      <FieldStatusBadge field={field} tooltip={false} />
      <Typography.Text strong ellipsis className={'field-name'}> {field.name ?? '-'} </Typography.Text>
      {!isAgronomist && <Typography.Text ellipsis>
        {t('Agronomist')}: {field.agronomist ? getUserFullName(field.agronomist) : '-'}
      </Typography.Text>}
      <Typography.Text> {t('crop')}: {field.crop ? t(field.crop.id) : '-'}</Typography.Text>
      <Typography.Text style={{ marginBottom: '8px' }}>
        {t('Planting date')}: {field.plantedAt ? getDateInFormat(field.plantedAt) : '-'}
      </Typography.Text>

    </Tooltip>
  )

}

export default TooltipInfo;
