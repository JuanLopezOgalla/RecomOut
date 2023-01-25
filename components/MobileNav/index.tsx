import React, { FC, useState, Fragment } from 'react';
import Container from '~/components/Screens/Container';
import AutoComplete from '~/components/Screens/AutoComplete';
import DetailedSearch from '~/components/Screens/DetailedSearch';
import Link from 'next/link';
import { connectAutoComplete } from 'react-instantsearch-dom';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useDispatch, useSelector } from 'react-redux';
import { setMonthlyRent, setBedRooms, setSearchText, setPrevSearchText } from '~/store/app/actions';
import { State } from '~/store/state';
import { cls } from '~/utils/functions';
import styles from './MobileNav.module.css';

interface MobileNavProps {
  darkHeader: boolean;
}

const MobileNav: FC<MobileNavProps> = (props: MobileNavProps) => {
  const { darkHeader } = props;

  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const dispatch = useDispatch();
  const searchData = useSelector<State, State>(state => state);

  const [visibleFirstBar, setVisibleFirstBar] = useState(false);
  const [visibleSecondBar, setVisibleSecondBar] = useState(false);

  const CustomAutocomplete = connectAutoComplete(AutoComplete);
  // const DefaultHit = connectHits(DefaultHome);

  const nextStep = () => {
    setVisibleSecondBar(true);
  };

  const clearSearch = () => {
    dispatch(setMonthlyRent(100000));
    dispatch(setBedRooms(0));
    dispatch(setSearchText(''));
    dispatch(setPrevSearchText(''));

    setVisibleFirstBar(false);
    setVisibleSecondBar(false);
  };

  return (
    <Fragment>
      <Container className={cls(['sm:hidden w-full rounded-full pt-2', darkHeader ? 'bg-white' : 'bg-role'])}>
        <div
          className="flex justify-center"
          onClick={() => {
            setVisibleFirstBar(true);
          }}
        >
          <i className={cls(['fa fa-search text-searchBox pt-2', styles.searchIcon])}></i>
          <div className="py-1.5 px-3 text-14 font-semibold">{t('header.TO_WHERE')}</div>
        </div>
      </Container>
      {
        <Container
          className={cls([
            styles.mobileSearch,
            'sm:hidden h-screen w-full bg-white fixed left-0 pt-20 pb-8 px-6',
            visibleFirstBar ? 'top-0' : 'top-full',
          ])}
        >
          <div className="flex relative">
            <i
              className="fa fa-angle-left text-20 mr-3 mt-1.5"
              onClick={() => {
                setVisibleFirstBar(false);
              }}
            ></i>
            <CustomAutocomplete nextStep={nextStep} />
            {/* {searchData.app.searchText === "" && <DefaultHit />} */}
          </div>
        </Container>
      }
      <Container
        className={cls([
          styles.mobileSearch,
          'sm:hidden h-screen w-full bg-white fixed left-0 pt-20 pb-8 px-6',
          visibleSecondBar ? 'top-0' : 'top-full',
        ])}
      >
        <div className="flex relative">
          <i
            className="fa fa-angle-left text-20 mr-3 mt-1.5"
            onClick={() => {
              setVisibleSecondBar(false);
            }}
          ></i>
          <div className="text-16 font-bold text-center pt-2 w-full">{searchData.app.searchText}</div>
        </div>
        <div className="mt-8">
          <DetailedSearch />
        </div>
        <div className="mt-16 flex justify-between">
          <div className="text-14 font-bold pt-3 underline w-1/4 text-center" onClick={clearSearch}>
            {t('home.CLEAR')}
          </div>
          <Link href={{ pathname: '/list', query }}>
            <a className="bg-searchBox text-14 text-white font-bold py-3 w-1/2 text-center rounded-lg">
              {t('home.SEARCH')}
            </a>
          </Link>
        </div>
      </Container>
    </Fragment>
  );
};

export default MobileNav;
