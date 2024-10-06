import { PropsWithChildren } from 'react';
import { Typography } from 'antd';

type CardCellProps = PropsWithChildren & {
  variant: 'title' | 'text'
  bordered?: boolean
}
const CardItem = ({ variant, bordered, ...props }: CardCellProps) => {
  const style = {
    borderBottom: bordered ? '1px solid rgba(0, 0, 0, 0.06)' : undefined,
    width: variant === 'title' ? '140px' : '200px'
  }

  return (
    <Typography.Text className="super_admin-mobile__card-item " style={style}>
      {props.children}
    </Typography.Text>
  );
};

export default CardItem;