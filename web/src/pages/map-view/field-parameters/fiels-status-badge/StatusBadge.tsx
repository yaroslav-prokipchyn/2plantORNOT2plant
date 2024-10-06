import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';
import { Flex, Tooltip, TooltipProps, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  isFieldDataEmpty,
  isPlantingDateValid,
} from 'src/pages/map-view/field-parameters/helpers/fieldValidator.ts';
import { Field } from 'src/types/Fields.ts';
import { useTranslation } from 'react-i18next';

type StatusBadgeProps = {
  isValid: boolean
  message?: string,
  className?: string,
  tooltip?: boolean
  tooltipProps?: TooltipProps
}

const StatusBadge = ({
  isValid,
  className,
  tooltip,
  message,
  tooltipProps
}: StatusBadgeProps) => {
  const { isAdmin } = useCurrentUser();

  return !isValid && isAdmin ? <Typography.Text className={className} type="warning">
      <Flex gap={'8px'}>
        {tooltip
          ? <Tooltip title={message} placement="topRight" {...tooltipProps}>
            <ExclamationCircleOutlined />
          </Tooltip>
          : <><ExclamationCircleOutlined />
            {message}</>
        }
      </Flex>
    </Typography.Text>
    : null
}

export const FieldStatusBadge = ({ field, className, tooltip, }: {
  field: Field,
  className?: string,
  tooltip?: boolean
}) => {
  const { t } = useTranslation();

  return <StatusBadge
    className={className}
    tooltip={tooltip}
    message={t('This field has missing data')}
    isValid={!isFieldDataEmpty(field)} />
}

export const DateStatusBadge = ({ date, className, tooltip, }: {
  date?: string,
  className?: string,
  tooltip?: boolean
}) => {
  const { t } = useTranslation();

  return <StatusBadge
    className={className}
    tooltip={tooltip}
    tooltipProps={{ placement: 'top', overlayStyle: { minWidth: 'max-content' } }}
    message={t('The planting date should precede locking date')}
    isValid={isPlantingDateValid(date)} />
}