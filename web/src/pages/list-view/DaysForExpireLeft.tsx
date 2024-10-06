import { Flex, Tag, Typography } from 'antd';
import { useDaysUntilExpiration } from './hooks/useDaysUntillExpiration';
import { useTranslation } from 'react-i18next';


export function DaysForExpireLeft() {
    const { leftDays }=  useDaysUntilExpiration()
    const { t } = useTranslation()
    return <Flex gap='8px'>
        <Typography.Text >
            {t("Days left")}:
        </Typography.Text>
        <Tag color='volcano'>{leftDays}</Tag>
    </Flex>
}

