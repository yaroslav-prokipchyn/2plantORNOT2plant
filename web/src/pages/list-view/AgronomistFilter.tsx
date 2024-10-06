import { ReactNode, useEffect, useState } from 'react';
import { Button, Flex, Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useWatch } from 'antd/es/form/Form';
import { useModal } from 'src/components/common/hooks/useModal.ts';
import useForm from 'src/components/common/hooks/useForm.ts';
import { Field } from 'src/types/Fields.ts';
import { Crop } from 'src/types/Crops.ts';
import cropsAPI from 'src/api/cropsAPI.ts';
import ButtonPopover from 'src/components/common/ButtonPopover.tsx';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { useQuery } from 'react-query';
import fieldsAPI from 'src/api/fieldsAPI.ts';

export type FilterPopoverProps = {
  fields: Field[] | undefined
  defaultValue?: FilterOptions
  onFilter: (value?: FilterOptions) => void,
  button: ({ onClick, isOpen }: { onClick: () => void, isOpen: boolean }) => ReactNode;
}

export type FilterOptions = {
  field: string[],
  crop: string[]
  parameter: string
  threshold: string
}

const Thresholds = {
  Critical: '4',
  Warning: '3',
  Normal: '2',
  Surplus: '1'
}

const Parameters = {
  //values are actually keys  for translations

  CurrentSoilWaterContentRisk: 'Current crop water use',
  ForecastSoilWaterContentRisk: 'Forecast crop water use',
  CurrentRiskOfBoggingRisk: 'Current Risk of bogging',
  ForecastRiskOfBoggingRisk: 'Forecast risk of bogging',
  CurrentRiskOfWaterShortageRisk: 'Current risk of water shortage',
  ForecastRiskOfWaterShortageRisk: 'Forecast risk of water shortage',

  ExpectedRainRisk: 'Expected rain'
}

const AgronomistFilter = ({ defaultValue, onFilter, button, ...props }: FilterPopoverProps) => {
  const { t } = useTranslation();
  const {
    data: fields = [],
  } = useQuery<Field[]>('fields:getFilterOptions', () => fieldsAPI.getAll())
  const { isCurrentOrganizationLocked } = useCurrentOrganization()
  const { form, setFormInitialValues } = useForm<FilterOptions>()
  const [isFilterOpen, showFilter, hideFilter] = useModal()
  const [crops, setCrops] = useState<Crop[]>([])

  useEffect(() => {
    cropsAPI.getAll().then(c => setCrops(c))
  }, []);

  const field = useWatch('field', form)
  const crop = useWatch('crop', form)
  const parameter = useWatch('parameter', form)
  const threshold = useWatch('threshold', form)

  useEffect(() => {
    form.resetFields()
    setFormInitialValues(defaultValue)
  }, [form, defaultValue, setFormInitialValues]);

  useEffect(() => {
    form.resetFields(['threshold'])
  }, [form, parameter]);

  const onClose = () => {
    onFilter(undefined)
    hideFilter()
    form.resetFields()
  }

  const onFinish = (values: FilterOptions) => {
    onFilter(Object.entries(values).reduce((acc, [key, value]) =>
      (Array.isArray(value) && value.length || !Array.isArray(value) && value) ? {
        ...acc,
        [key]: value
      } : acc, {} as FilterOptions))
    hideFilter()
  }

  const handleOpenChange = (open: boolean) => open ? showFilter() : hideFilter()

  const isFilterAvailable = parameter ? parameter && threshold : crop?.length || field?.length

  if (!fields) return

  return (
    <ButtonPopover
      open={isFilterOpen}
      onButtonClick={showFilter}
      onOpenChange={handleOpenChange}
      button={button}
      content={
        <Form
          form={form}
          className="form__filter"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item<FilterOptions>
            label={t('By field name')}
            name="field"
          >
            <Select
              getPopupContainer={(trigger) => trigger.parentElement}
              showSearch={false}
              mode="multiple"
              size="large"
              className="full-width"
              placeholder={t('Select field')}
              allowClear
            >
              {fields.map(({ name, id }) =>
                <Select.Option label={name} key={id} value={name}>
                  {name}
                </Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item<FilterOptions>
            label={t('By crop type')}
            name="crop"
          >
            <Select
              getPopupContainer={(trigger) => trigger.parentElement}
              showSearch={false}
              mode="multiple"
              allowClear
              size="large"
              placeholder={t('Select crop type')}>
              {crops.map((c) =>
                <Select.Option key={c.id} value={c.id}>{t(c.id)}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item<FilterOptions>
            hidden={!isCurrentOrganizationLocked}
            label={t('By parameter')}
            name="parameter"
          >
            <Select
              getPopupContainer={(trigger) => trigger.parentElement}
              showSearch={false}
              allowClear
              size="large"
              placeholder={t('Select parameter')}
            >
              {Object.entries(Parameters).map(([id, name]) =>
                <Select.Option key={id} value={id}>{t(name)}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item<FilterOptions>
            hidden={!parameter}
            name="threshold"
          >
            <Select
              getPopupContainer={(trigger) => trigger.parentElement}
              showSearch={false}
              allowClear
              size="large"
              placeholder={t('Select threshold')}
            >
              {Object.entries(Thresholds).map(([name, id]) =>
                <Select.Option key={id} value={id}>{t(name)}</Select.Option>)}
            </Select>
          </Form.Item>
          <Flex className="filter-popover__buttons" gap="small" align="center" justify="end">
            <Button onClick={onClose} size="large">{t('Cancel')}</Button>
            <Button
              onClick={form.submit}
              type="primary"
              size="large"
              disabled={!isFilterAvailable}
            >
              {t('Filter')}
            </Button>
          </Flex>
        </Form>
      }
      {...props}
    />
  )
}

export default AgronomistFilter;
