import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd'

const CenteredModal = ({ ...props }: AntdModalProps) => {
  return (
    <AntdModal
      forceRender={true}
      maskClosable={false}
      width="auto"
      centered
      {...props}
    >
    </AntdModal>
  );
};

export default CenteredModal;
