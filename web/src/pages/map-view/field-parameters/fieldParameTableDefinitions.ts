import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';

export const columns: () => ColumnsType<FieldParametersTableRow> = () => [
    {
        title: "",
        dataIndex: "parameter",
        key: "parameter",
    },
    {
        title: t("Current status"),
        render: (v: FieldParametersTableRow) => v.render(v.currentValue),
        key: "currentValue",
    },
    {
        title: t("Weekly forecast"),
        render: (v: FieldParametersTableRow) => v.render(v.forecastValue),
        key: "forecastValue",
    },
];

export type FieldParametersTableRow = {
    parameter: string;
    forecastValue: string | undefined;
    render: (value?: string) => string;
    currentValue: string | undefined
};
