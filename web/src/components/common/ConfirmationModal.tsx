import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalFuncProps } from 'antd/es/modal/interface';
import { useTranslation } from 'react-i18next';

const baseConfig: ModalFuncProps = {
  className: 'modal__confirm',
  centered: true,
  icon: <ExclamationCircleOutlined />,
  cancelText: 'Cancel',
  cancelButtonProps: { size: 'large' },
}

const useConfirmationModal = () => {
  const [modal, contextHolder] = Modal.useModal();
  const { t }=useTranslation()
  return ({
    contextHolder,
    confirm: ({ title, content, onOk, ...props }: ModalFuncProps) => {
      modal.confirm({
        ...baseConfig,
        okText: t('Confirm'),
        cancelText: t('Cancel'),
        okButtonProps: { size: 'large' },
        title,
        content,
        onOk,
        ...props
      })
    },
    delete: ({ title, content, onOk, ...props }: ModalFuncProps) => {
      modal.confirm({
        ...baseConfig,
        okText: t('Delete'),
        okButtonProps: { danger: true, size: 'large' },
        title,
        content,
        onOk,
        ...props
      })
    }
  })
}

export default useConfirmationModal
