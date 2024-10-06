import { Column } from '@antv/g2plot';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { ChartItem } from './AddIrigationModal';
import { getDateInFormat } from 'src/helpers/dateFormat';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'src/context/hooks/useUnitContext';

type Props = {
    data: ChartItem[]
}

type ChartScrollBar = {
    scrollbar: {
        component: { updateThumbOffset: (value: number) => void }
    }
}

const getXAxisLabelColor = (isFirstDayOfMonth: boolean, isLastDay: boolean) => {
    if (isFirstDayOfMonth) {
        return 'rgba(0, 0, 0, 0.88)'
    }

    if (isLastDay) {
        return '#1677FF'
    }
    return 'rgba(0, 0, 0, 0.45)'

}


export const IrrigationChart = ({ data }: Props) => {
    const isSmallMobileDevice = useMediaQuery('only screen and (max-width : 500px)');
    const { t } = useTranslation();
    const { roundWithUnits } = useUnit()


    const chartContainer = useRef(null);
    useEffect(() => {
        if (!chartContainer.current) return;

        const columnPlot = new Column(chartContainer.current, {
            data,
            xField: 'date',
            yField: 'value',
            scrollbar: { type: 'horizontal', animate: false, categorySize: 40, },

            columnStyle: (chartItem) => {
                return {
                    fillOpacity: 0.8,
                    cursor: 'pointer',
                    fill: dayjs(chartItem.date).isSame(dayjs(), 'day') ? '#1677FF' : '#69B1FF',
                };
            },
            xAxis: {     
                label: {
                    formatter: (date) => {
                        return dayjs(date).format('MMM D')
                    },

                    autoHide: false,
                    style: (day) => {
                        const isLastDay = dayjs(day, 'MMM D').isSame(dayjs(), 'day');
                        const isFirstDayOfMonth = day.split(' ')[1] === '01';

                        return {
                            fontSize: 10,
                            fontWeight: (isFirstDayOfMonth || isLastDay) ? 600 : 400,
                            fill: getXAxisLabelColor(isFirstDayOfMonth, isLastDay),
                         
                        }
                    }
                },

            },

            tooltip: {
                customContent: (x, data) => {
                    return `<div id='chart-tooltip' style="background-color: white; font-size: 12px; padding-top: 10px">
                                <p><span  style="color: rgba(0, 0, 0, 0.45)">${t('Date')}:</span> ${getDateInFormat(x)}</p>
                                <p><span  style="color: rgba(0, 0, 0, 0.45)">${t('Volume')}:</span> ${roundWithUnits(data[0]?.data?.value)}</p>
                            </div>`;
                }
            }

        });

        columnPlot.render();

        //NOTE: for scroll canvas chart to the right view
        const scrollbarComponent = (columnPlot.chart.getController('scrollbar') as unknown as ChartScrollBar)?.scrollbar.component;
        scrollbarComponent.updateThumbOffset(Infinity);

        return () => {
            columnPlot.destroy();
        };


    }, [t, data, roundWithUnits ]);

    return <div style={{ width: isSmallMobileDevice ? '300px' : '360px', height: '170px' }} ref={chartContainer} ></div>;
}
