import { useState } from 'react';
import { Button, Dropdown, Flex } from 'antd';
import classNames from 'classnames';
import { UserOutlined } from '@ant-design/icons';
import { LanguageSwitch } from "src/i18n/LanguageSwith.tsx";
import { UnitSwitch } from '../UnitSwitch';
import './profile-dropdown.css'


function ProfileDropdown() {
  const [isVisible, setIsvisible] = useState(false);

  return <Dropdown
    trigger={['click']}
    onOpenChange={setIsvisible}
    dropdownRender={() => (
      <div className='profile-dropdown'>
        <Flex
          gap='24px'
          className='profile-dropdown__content'
        >
          <LanguageSwitch />
          <UnitSwitch size='large' id='unit-switch' />
        </Flex>
      </div>
    )}
  >
    <Button size='large' type='text' className={classNames({ 'profile-dropdown__button-active': isVisible })} icon={<UserOutlined />}  />
  </Dropdown>
}

export default ProfileDropdown;
