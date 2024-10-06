import { PropsWithChildren } from 'react';
import { Flex } from 'antd';

import 'src/pages/map-view/styles/field-parameters.css';

type FieldParametersLayoutProps = PropsWithChildren & {
  additionalClasses?: string[]
}

function FieldParametersLayout({ additionalClasses = [], ...props }: FieldParametersLayoutProps) {
  const classNames = `map-bottom-menu-wrapper ${additionalClasses.join(' ')}`

  return (
    <Flex className={classNames}>
      <Flex gap={48} className="map-bottom-menu">
        {props.children}
      </Flex>
    </Flex>
  )
}

export default FieldParametersLayout;
