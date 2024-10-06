import { Radio, RadioGroupProps } from "antd";
import { useUnit } from "src/context/hooks/useUnitContext";
import { useTranslation } from 'react-i18next';

export const UnitSwitch = ({ ...props }: RadioGroupProps) => {
    const { t } = useTranslation();
    const { unitSystem, setUnitSystem } = useUnit()

    return <Radio.Group size='large' style={{ width: "100%"  }}
        options={[{ label: t("Metric"), value: "metric" }, { label: t("Imperial"), value: "imperial" }]}
        onChange={({ target: { value: unit } }) => setUnitSystem(unit)}
        defaultValue={unitSystem}
        optionType={"button"}
        {...props}
         />;
};
