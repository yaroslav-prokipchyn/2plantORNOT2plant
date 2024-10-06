import { Table as AntTable, TableProps as AntTableProps } from 'antd'
import './table.css';

type Props = {
  height: string | number
  minWidth?: string | number
}

const LargeTableWithScroll = ({ minWidth, height, ...props }: AntTableProps & Props) => {
  return (
    <AntTable
      size="large"
      scroll={{ x: minWidth ? minWidth : true, y: height }}
      className="table-wrapper"
      pagination={false}
      {...props}
    />
  );
};

export default LargeTableWithScroll;
