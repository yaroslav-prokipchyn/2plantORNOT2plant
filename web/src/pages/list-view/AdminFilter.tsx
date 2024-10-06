import { Button, Flex, Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { ReactNode, useEffect } from 'react';
import CategoryTag from 'src/pages/map-view/categories/CategoryTag.tsx';
import { useWatch } from 'antd/es/form/Form';
import { useModal } from 'src/components/common/hooks/useModal.ts';
import useForm from 'src/components/common/hooks/useForm.ts';
import { Category } from 'src/types/Organizations.ts';
import ButtonPopover from 'src/components/common/ButtonPopover.tsx';

export type FilterPopoverProps = {
  defaultValue?: Category
  onFilter: (value?: Category) => void,
  button: ({ onClick, isOpen }: { onClick: () => void, isOpen: boolean }) => ReactNode;
}

const AdminFilter = ({ defaultValue, onFilter, button, ...props }: FilterPopoverProps) => {
  const { t } = useTranslation();
  const { form, setFormInitialValues } = useForm<Category>()
  const { currentOrganization } = useCurrentOrganization()
  const [isFilterOpen, showFilter, hideFilter] = useModal()

  const name = useWatch('name', form)
  const options = useWatch('allowedOptions', form)

  useEffect(() => {
    setFormInitialValues({ name: defaultValue?.name, allowedOptions: defaultValue?.allowedOptions })
  }, [defaultValue, setFormInitialValues]);

  useEffect(() => {
    form.resetFields(['allowedOptions'])
  }, [form, name]);

  const onClose = () => {
    onFilter(undefined)
    hideFilter()
    form.resetFields()
  }

  const onFinish = (values: Category) => {
    onFilter(values)
    hideFilter()
  }

  const selectedCategory = currentOrganization.categories.find(({ name: category }) => category === name);

  const handleOpenChange = (open: boolean) => open ? showFilter() : hideFilter()

  return (
    <ButtonPopover
      open={isFilterOpen}
      onButtonClick={showFilter}
      onOpenChange={handleOpenChange}
      button={button}
      content={
        <Form
          form={form}
          className="form__field-details"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item<Category>
            label={t('By category')}
            name="name"
          >
            <Select
              size="large"
              className="full-width"
              placeholder={t('Select category')}
            >
              {currentOrganization?.categories.map((c) =>
                <Select.Option label={c.name} key={c.key} value={c.name}>
                  {c.name}
                </Select.Option>
              )}
            </Select>
          </Form.Item>
          {selectedCategory &&
          <Form.Item<Category>
            name="allowedOptions"
            hidden={!name}
            rules={[{ required: true, message: t('Please select option!') }]}
          >
            <Select
              size="large"
              mode="multiple"
              className="full-width"
              optionLabelProp="label"
              placeholder={t('Select option')}
              maxCount={5}
              tagRender={({ label, ...props }) => {
                const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                  event.preventDefault();
                  event.stopPropagation();
                };
                return (
                  <CategoryTag
                    {...props}
                    categoryKey={selectedCategory!.key}
                    label={String(label)}
                    onMouseDown={onPreventMouseDown}
                    className="large-category-tag"
                  />
                );
              }}
            >
              {selectedCategory?.allowedOptions?.map((option) =>
                <Select.Option label={option} key={option} value={option}>
                  {option}
                </Select.Option>
              )}
            </Select>
          </Form.Item>}
          <Flex className="filter-popover__buttons" gap="small" align="center" justify="end">
            <Button onClick={onClose} size="large">{t('Cancel')}</Button>
            <Button
              onClick={form.submit}
              type="primary"
              size="large"
              disabled={!(name && options?.length)}
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

export default AdminFilter;
