import { ReactNode } from 'react';
import { Popover } from 'antd';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useTranslation } from 'react-i18next';

export type PopoverProps = {
  open: boolean,
  onButtonClick: () => void
  onOpenChange: (open: boolean) => void
  content: ReactNode,
  button: ({ onClick, isOpen }: { onClick: () => void, isOpen: boolean }) => ReactNode;
}

const ButtonPopover = ({
  open,
  onOpenChange,
  onButtonClick,
  content,
  button,
  ...props
}: PopoverProps) => {
  const isMobile = useMediaQuery('only screen and (max-width : 700px)');
  const { t } = useTranslation()

  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      forceRender={true}
      arrow={false}
      title={t("Filter")}
      trigger="click"
      placement={isMobile ? 'bottom' : 'bottomLeft'}
      overlayClassName="filter-popover"
      content={content}
      {...props}
    >
      {button({ onClick: onButtonClick, isOpen: open })}
    </Popover>
  )
}

export default ButtonPopover;
