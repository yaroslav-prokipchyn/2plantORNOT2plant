import { Tag } from 'antd';
import { Organization } from 'src/types/Organizations.ts';
import { useTranslation } from 'react-i18next';

type Status = 'locked' | 'draft'

const OrganizationStatusTag = ({ locked }: Pick<Organization, 'locked'>) => {
  const status: Status = locked ? 'locked' : 'draft'
  const { t } = useTranslation();

  const tagColor: Record<Status, 'blue' | 'orange'> = {
    'locked' : 'blue',
    'draft' : 'orange'
  }

  return <Tag color={tagColor[status]}>{t(status)}</Tag>
}

export default OrganizationStatusTag
