import { Button, message, Modal, Upload, UploadFile } from 'antd';
import { useState } from 'react';
import { UploadChangeParam } from 'antd/es/upload';
import { InboxOutlined } from '@ant-design/icons';
import fieldsAPI from 'src/api/fieldsAPI.ts';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next'; // Added useTranslation hook
import { pathNames } from 'src/config/constants.ts';
import useFields from "src/pages/map-view/hooks/useFields.ts";

const { Dragger } = Upload;

export const FieldUploadDialog = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage()
  const { t } = useTranslation(); // Added useTranslation hook

  const navigate = useNavigate();
  const { refetchFields } = useFields();

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file.originFileObj as File);
    });
    setIsLoading(true);
    try {
      await fieldsAPI.uploadFiles(formData);
      messageApi.success(t('uploadSuccess'));
    } catch (e) {
      messageApi.error(t('uploadError'));
    }
    refetchFields();
    setIsLoading(false);
    setFiles([]);
    setOpen(false);
  };

  const handleCancel = () => {
    setFiles([]);
    setOpen(false);
  };

  const addFiles = (info: UploadChangeParam<UploadFile>) => {
    setFiles(info.fileList);
  };

  const uploadProps: Parameters<typeof Upload>[0] = {
    accept: '.cpg,.dbf,.prj,.shp,.shx',
    fileList: files,
    disabled: isLoading,
    onChange: addFiles,
    multiple: true,
    beforeUpload: () => false,
  };

  return (
    <>
      {messageContextHolder}
      <Button size={'large'} className={className} onClick={() => { setOpen(true); navigate(pathNames.MAP_VIEW); }} type={'primary'}>
        {t('+ Upload fields')}
      </Button>
      <Modal
        maskClosable={false}
        centered
        className={'files-upload-dialog'}
        width={408}
        title={t('uploadDialogTitle')}
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} size={'large'} disabled={isLoading}>
            {t('Cancel')}
          </Button>,
          <Button key="upload" type="primary" onClick={handleUpload} disabled={files.length === 0} loading={isLoading} size={'large'}>
            {t('Upload')}
          </Button>,
        ]}
      >
        {files.length === 0 && (
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t('dragText')}</p>
            <div className="ant-upload-hint">{t('uploadHint')}</div>
          </Dragger>
        )}
        {files.length > 0 && (
          <Upload {...uploadProps}>
            <Button type={'link'} disabled={isLoading}>{t('addMoreFiles')}</Button>
          </Upload>
        )}
      </Modal>
    </>
  );
}

