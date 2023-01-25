import React, { FC, useState } from 'react';
import Container from '~/components/Screens/Container';
import { Checkbox } from 'antd';
import { cls } from '~/utils/functions';
import styles from './MenuSelect.module.css';
import { useTranslation } from 'next-export-i18n';

interface RefineItem {
  isRefined: boolean;
  value: string;
  label: string;
}

interface MenuSelectProps {
  items: RefineItem[];
  currentRefinement: string;
  refine: (value: string) => void;
  searchItem: string;
  searchValue: string;
  changeValue: (value: string) => void;
}

const MenuSelect: FC<MenuSelectProps> = (props: MenuSelectProps) => {
  const { items, currentRefinement, refine, searchItem, searchValue, changeValue } = props;

  const { t } = useTranslation();

  const [visibleDropDown, setVisibleDropDown] = useState(false);

  const onChange = (value: string) => {
    changeValue(value);

    setTimeout(() => {
      refine(value);
    }, 500);
  };

  const toggleDropDown = () => {
    setVisibleDropDown(value => !value);
  };

  return (
    <Container className={cls(['relative w-full sm:w-1/2 cursor-pointer pr-2 mt-2 sm:mt-0', styles.menuSelect])}>
      <div
        className="flex justify-between border border-solid border-black border-opacity-20 rounded-lg px-4 py-2"
        onClick={toggleDropDown}
      >
        <span className="text-14 text-black capitalize">{!searchValue ? searchItem : searchValue}</span>
        {visibleDropDown ? <i className="fa fa-angle-down"></i> : <i className="fa fa-angle-right"></i>}
      </div>
      {visibleDropDown && (
        <ul className="absolute w-full h-40 bg-white rounded-lg z-10 px-3 py-4 top-12 shadowwrap overflow-y-auto sm:mt-2">
          <li className="py-1">
            <Checkbox
              onChange={() => {
                onChange('');
              }}
              checked={searchValue === ''}
            >
              {t('list.SELECT_ALL')}
            </Checkbox>
          </li>
          {items.map(item => (
            <li className="py-1 capitalize">
              <Checkbox
                onChange={() => {
                  onChange(item.isRefined ? currentRefinement : item.value);
                }}
                checked={searchValue === (item.isRefined ? currentRefinement : item.value)}
              >
                {item.label}
              </Checkbox>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default MenuSelect;
