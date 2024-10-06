import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat)

export const CURRENT_DATE_FORMAT = 'll';

export const getDateInFormat = (value: string) => (dayjs(value).format(CURRENT_DATE_FORMAT));

export const getPayloadDate = (value: Dayjs | Date): string => dayjs(value).format('YYYY-MM-DD');
