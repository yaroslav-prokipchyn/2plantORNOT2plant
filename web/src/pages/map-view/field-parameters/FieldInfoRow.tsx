import React, { ComponentProps } from 'react';
import { Skeleton, Typography, TypographyProps } from 'antd';

type FieldInfoRowProps = ComponentProps<TypographyProps> & {
  showLoading?: boolean,
  loading?: boolean,
  children: React.ReactNode
}

const FieldInfoRow = ({ showLoading, loading, children, ...props }: FieldInfoRowProps) => {
  return showLoading && loading
    ? <Skeleton
      active
      title={false}
      paragraph={{ rows: 1, width: [80] }}
      className="full-width"
    />
    : <Typography.Text className="field-info__row" {...props}>
      {children}
    </Typography.Text>

}

export default FieldInfoRow