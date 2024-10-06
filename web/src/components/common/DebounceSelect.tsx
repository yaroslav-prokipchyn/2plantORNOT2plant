import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from 'lodash';
import { Empty, Select, SelectProps, Spin } from "antd"

export interface DebounceSelectProps<ValueType>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

export function DebounceSelect<ValueType extends { label: React.ReactNode; value: string | number }>
({ fetchOptions, debounceTimeout = 500,  ...props }: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const indexRef = useRef(0);

  useEffect(()=>{
    setFetching(true);
    fetchOptions('').then((options) => {
      setOptions(options);
      setFetching(false);
    })

  }, [fetchOptions])

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      indexRef.current += 1;
      setOptions([])
      const index = indexRef.current;

      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (index !== indexRef.current) {
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <>
     <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      showSearch
      notFoundContent={fetching ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      options={options}
      {...props}
    />
    </>
 
  );
}
