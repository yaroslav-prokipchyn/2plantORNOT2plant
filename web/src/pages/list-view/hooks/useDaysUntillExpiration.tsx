import dayjs, { Dayjs } from 'dayjs';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext';

function getDaysUntilExpiration(startDate: Dayjs, expirationDays: number): number {
    const today = dayjs();
    const daysPassed = today.diff(startDate, 'days')

    return  expirationDays - daysPassed;
}

export function useDaysUntilExpiration (){
    const EXPIRATION_DAYS = 130;
    const { lockedAt } = useCurrentOrganization();
    const leftDays = getDaysUntilExpiration(dayjs(lockedAt), EXPIRATION_DAYS);

    return { leftDays, isExpire: leftDays <= 0  }
}