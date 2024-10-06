import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Space, Table, TableProps, Tooltip, Typography } from 'antd';
import { Field } from 'src/types/Fields';
import useIrrigationUpdate from 'src/pages/list-view/irrigation-review/useIrrigationUpdate.ts';
import { getIconSrc } from 'src/pages/list-view/dashboardIcon.ts';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import IrrigationEditableCell from 'src/pages/list-view/irrigation-review/IrrigationEditableCell.tsx';
import { useMediaQuery } from '@uidotdev/usehooks';
import {
  getDaysAfterFirstPlanting,
  isToday,
  splitDaysIntoChunks
} from 'src/pages/list-view/irrigation-review/helpers.ts';

export type TableIrrigation = {
  id?: string;
  value?: number;
  date: string;
  fieldId: string;
  isEdited: boolean
}

export type FieldWithIrrigation = Field & { irrigations: TableIrrigation[] }

type IrrigationReviewColumnProps = {
  datesByWeeks: string[][],
  currentWeekIndex: number,
  handleEdit: (irrigation: TableIrrigation) => void,
  showPreviousWeek: () => void,
  showNextWeek: () => void
  isMobile: boolean
}

const getIrrigationReviewColumns = ({
  datesByWeeks,
  currentWeekIndex,
  handleEdit,
  showPreviousWeek,
  showNextWeek,
  isMobile
}: IrrigationReviewColumnProps): TableProps<FieldWithIrrigation>['columns'] => ([
  {
    title: t('Field name'),
    key: 'crop',
    width: isMobile ? 200 : '25%',
    fixed: 'left',
    sorter: (a: Field, b: Field) => (a?.name ?? '').localeCompare(b?.name ?? ''),
    showSorterTooltip: { zIndex: 1000000 },
    render: (field: Field) => {
      return (
        <Flex key={field.id} justify="space-between">
          <Space style={{ columnGap: '8px', textWrap: 'wrap', wordBreak: 'break-word' }}>
            {field.crop && <Tooltip placement="top" title={t(field.crop.id)}>
              <img src={getIconSrc(field.crop)} alt={`${field.crop.id}`} />
            </Tooltip>}
            {field.name}
          </Space>
        </Flex>
      );
    }
  },
  {
    title: <Button
      type="text"
      disabled={currentWeekIndex === datesByWeeks.length - 1}
      onClick={showPreviousWeek}
      size="small"
      icon={<LeftOutlined />}
    />,
    className: 'table__left-arrow',
    key: 'previous',
    width: isMobile ? 30 : '5%',
    fixed: 'left',
  },
  ...datesByWeeks[currentWeekIndex].map((date) => ({
    title: <DateColumnTitle date={date} />,
    key: `irrigationAmount-${date}`,
    width: isMobile ? 70 : '10%',
    className: classNames('table__irrigation-cell', { 'active': isToday(date) }),
    render: (field: FieldWithIrrigation) => {
      return (
        <IrrigationEditableCell
          field={field}
          date={date}
          onEdit={handleEdit}
        />
      )
    }
  })),
  {
    title: <Button
      disabled={currentWeekIndex === 0}
      type="text"
      size="small"
      onClick={showNextWeek}
      icon={<RightOutlined />}
    />,
    className: 'table__right-arrow',
    key: 'next',
    width: isMobile ? 30 : '5%',
    fixed: 'right',
  }
])

type IrrigationReviewProps = {
  fields: Field[]
  exit: () => void
}

function IrrigationReview({ fields, exit }: IrrigationReviewProps) {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState<string[][]>()
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0)
  const isMiddleScreen = useMediaQuery('only screen and (700px < width < 1194px)');
  const isMobile = useMediaQuery('only screen and (max-width : 700px)');
  const irrigationDays = useMemo(() => getDaysAfterFirstPlanting(fields), [fields]);

  const {
    fieldsWithIrrigations,
    isLoading,
    handleEditIrrigations,
    handleSubmitIrrigations,
    changedIrrigationsExist,
  } = useIrrigationUpdate(fields, irrigationDays)

  const handlePreviousWeek = () => setCurrentWeekIndex((prev) => prev + 1)

  const handleNextWeek = () => setCurrentWeekIndex((prev) => prev - 1)

  useEffect(() => {
    const chunkLength = isMiddleScreen ? 4 : isMobile ? 1 : 7;
    setWeeks(splitDaysIntoChunks(irrigationDays, chunkLength))
  }, [irrigationDays, isMiddleScreen, isMobile]);

  const handleSubmitIrrigationUpdates = async () => {
    await handleSubmitIrrigations()
  }

  if (!weeks) return

  return (
    <Flex vertical>
      <Flex gap="small" align="center" className="dashboard-buttons-irrigations">
        <Flex gap="small">
          <Button
            disabled={!changedIrrigationsExist}
            type="primary"
            onClick={handleSubmitIrrigationUpdates}
            size="large"
            className="btn-w160"
          >
            {t('Submit update')}
          </Button>
          <Button
            onClick={exit}
            size="large"
            className="btn-w160"
          >
            {t('Exit')}
          </Button>
        </Flex>
      </Flex>
      <Table
        className="table__irrigation-review"
        rowKey="id"
        bordered
        pagination={false}
        scroll={{ y: 'calc(100vh - 310px)' }}
        loading={isLoading || !weeks || !fieldsWithIrrigations}
        dataSource={Object.values(fieldsWithIrrigations ?? {})}
        columns={getIrrigationReviewColumns({
          datesByWeeks: weeks,
          currentWeekIndex,
          handleEdit: handleEditIrrigations,
          showPreviousWeek: handlePreviousWeek,
          showNextWeek: handleNextWeek,
          isMobile,
        })}
      />
    </Flex>
  )
}

const DateColumnTitle = ({ date }: { date: string }) => {
  return (
    <Flex className="table__irrigation-date-title" vertical align="center">
      <Typography.Text> {dayjs(date).format('D ddd')} </Typography.Text>
      <Typography.Text> {dayjs(date).format('MMM, YYYY')} </Typography.Text>
    </Flex>
  )
}


export default IrrigationReview;
