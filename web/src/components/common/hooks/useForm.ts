import { Form, FormInstance } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { StoreValue, ValidateOptions } from 'rc-field-form/es/interface';

type ErrorField = {
  errors: string[]
  name: string[]
  warnings: string[]
}

type Errors<E> = {
  errorFields: ErrorField[],
  values: E,
  outOfDate: boolean
}

const useForm = <T>(): {
  form: FormInstance<T>,
  errors: Errors<T> | undefined,
  allFieldsValid: boolean,
  validateFields: (nameList?: string[], options?: ValidateOptions) => void
  setFormInitialValues: (values: StoreValue) => void
  fieldsValueArePresent: (nameList: string[]) => boolean
} => {
  const [form] = Form.useForm<T>();
  const [allFieldsValid, setAllFieldsValid] = useState<boolean>(false)
  const [errors, setErrors] = useState<Errors<T> | undefined>(undefined)

  const fieldsValueArePresent = (nameList: string[]) => {
    return Object.values(form.getFieldsValue(nameList)).every(value => value)
  }

  const setFormInitialValues = useCallback((values: StoreValue) => {
    form.setFieldsValue(values)
    setAllFieldsValid(false)
  }, [form])

  const validateFields = async (nameList?: string[], options?: ValidateOptions) => {
    try {
      nameList
        ? await form.validateFields(nameList, { validateOnly: true, ...options })
        : await form.validateFields({ validateOnly: true });

      setAllFieldsValid(true);
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      setErrors(error.errorFields)
      setAllFieldsValid(!error.errorFields.length)
    }
  }

  useEffect(() => {
    setAllFieldsValid(false)

    return () => form.resetFields();
  }, [form]);

  return { form, allFieldsValid, validateFields, errors, fieldsValueArePresent, setFormInitialValues }
}

export default useForm