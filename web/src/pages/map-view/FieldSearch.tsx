import { Button, Flex } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { DebounceSelect } from 'src/components/common/DebounceSelect';
import fieldsAPI from 'src/api/fieldsAPI';

import { pathNames } from 'src/config/constants';
import { useNavigate } from 'react-router';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext';
import { useEffect, useRef, useState } from 'react';
import { getUserFullName } from 'src/helpers/getUserFullName.ts';
import { useTranslation } from 'react-i18next';

export const FieldSearch = () => {
    const searchRef = useRef<HTMLDivElement>(null)
    const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
    const isMobileDevice = useMediaQuery('only screen and (max-width : 925px)');
    const { isAgronomist } = useCurrentUser();
    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(()=> {
        const handleClick = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node) && isSearchActive) {
              setIsSearchActive(false)
            }
          };
          document.addEventListener('click', handleClick);

          return () => document.removeEventListener('click', handleClick);
    },[isSearchActive])

  const getOptionsByName = (name: string, isAgronomist?: boolean) => fieldsAPI.getAll(name).then(res => {
    return res.map((field) => ({
      value: field.id,
      label: isAgronomist
        ? `${field.name ?? t('No name')}, ${field.crop? t(field.crop.id) : t('Crop not assigned')}`
        : `${field.name ?? t('No name')}, ${field.agronomist ? getUserFullName(field.agronomist) : t('Not Assigned agronomist')}, ${field.crop? t(field.crop.id) : t('Crop not assigned')}`
    }))
  })

    return (
        <Flex
          ref={searchRef}
            justify="flex-end"
            align="center"
            className='map-container__search-wrapper'
            id='map-container-search-wrapper'>
            {isSearchActive && (
                <DebounceSelect    
                    autoFocus
                    className="map-container__search"
                    defaultOpen
                    placeholder={t("Search")}
                    dropdownStyle={{ width: isMobileDevice ? 'calc(100vw - 48px)' : '463px' }}
                    onSelect={(fieldOption) => {
                        navigate(`${pathNames.MAP_VIEW}/${fieldOption.value}`)
                        setIsSearchActive(false)
                    }}
                    suffixIcon=""
                    fetchOptions={(name) => getOptionsByName(name, isAgronomist)} />
            )}

            <Button id={isSearchActive ?
                'map-container-search-button-active' :
                'map-container-search-button'}
                size="large" icon={<SearchOutlined />}
                onClick={() => setIsSearchActive(true)}
            />
        </Flex>)
}

