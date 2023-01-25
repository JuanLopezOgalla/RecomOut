import React, { FC, useState } from 'react';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { connectAutoComplete, connectRange } from 'react-instantsearch-dom';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from './ListHeader.module.css';
import { cls } from '~/utils/functions';
import { minQuantity, maxQuantity, maxMonthlyRent } from '~/utils/constants';
import Logo from '~/components/Screens/Logo';
import AutoComplete from '~/components/Screens/AutoComplete';
import NavBar from '~/components/Screens/NavBar';
import Home from '~/components/HomeNav';
import Auth from '~/components/AuthNav';
import CurrencyLanguageBar from '~/components/Screens/CurrencyLanguageBar';
import WishList from '~/components/Screens/WishList';
import IncDecInput from '~/components/Screens/IncDecInput';
import SliderRange from '~/components/Screens/SliderRange';
import { ROUTES } from '~/utils/routes';
import { State } from '~/store/state';
import Close from '~/public/icons/close.svg';

const ListHeader: FC = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();

  const searchData = useSelector<State, State>(state => state);
  const CustomAutocomplete = connectAutoComplete(AutoComplete);
  const SearchByBedRooms = connectRange(IncDecInput);
  const SearchByMonthlyRent = connectRange(SliderRange);

  const [visibleMobileSearchBar, setVisibleMobileSearchBar] = useState(false);

  const goList = () => {
    router.push(`${ROUTES.LIST}?lang=${query.lang}`);
  };

  const sendSearch = () => {
    router.push(`${ROUTES.LIST}?lang=${query.lang}`);
  };

  const isPropertiesOrAgent = () => {
    return (
      router.pathname === ROUTES.PROPERTIES ||
      router.pathname === ROUTES.AGENT ||
      router.pathname === ROUTES.LISTING_ADD ||
      router.pathname === ROUTES.CONTACT
    );
  };

  const isSearchPages = () => {
    return (
      router.pathname === ROUTES.HOME ||
      router.pathname === ROUTES.LIST ||
      router.pathname === ROUTES.ITEM ||
      router.pathname === ROUTES.PROFILE
    );
  };

  return (
    <header
      className={cls([
        styles.header,
        'fixed flex z-20 w-full px-4 md:px-8 h-header pt-4 top-0',
        !isPropertiesOrAgent() ? 'bg-white sm:bg-listBackground' : 'bg-transparent',
        isPropertiesOrAgent() ? 'hidden md:flex' : '',
      ])}
      id="listHeader"
    >
      <div className="flex w-full sm:w-1/2 2xl:w-3/5 justify-between">
        <Logo linkTo="/" darkHeader={router.pathname === ROUTES.LISTING_ADD} />
        {!isPropertiesOrAgent() && (
          <div className="hidden bg-white rounded-full px-4 py-2 h-14 2xl:flex w-full">
            <div className="w-1/2">
              <CustomAutocomplete defaultRefinement={searchData.app.searchText} />
            </div>
            <SearchByBedRooms
              attribute="property.beds"
              defaultRefinement={{ min: minQuantity, max: maxQuantity }}
              min={minQuantity}
              max={maxQuantity}
              translations={{ submit: 'ok', separator: 'to' }}
            />
            <SearchByMonthlyRent
              attribute="amount"
              defaultRefinement={{ min: minQuantity, max: maxMonthlyRent }}
              min={minQuantity}
              max={maxMonthlyRent}
              translations={{ submit: 'ok', separator: 'to' }}
            />
            <i
              className={cls([
                'fa fa-search text-white bg-black rounded-full p-2.5 cursor-pointer',
                styles.magnifyIcon,
              ])}
              onClick={goList}
            ></i>
          </div>
        )}
        {!isPropertiesOrAgent() && (
          <div
            className={cls([
              '2xl:hidden w-full flex justify-center cursor-pointer bg-role rounded-full mt-2 text-black pt-3.5 h-12 px-2',
              styles.searchBar,
            ])}
            onClick={() => {
              setVisibleMobileSearchBar(true);
            }}
          >
            {searchData.app.searchText ? (
              <div className="text-14 font-medium text-ellipsis overflow-hidden whitespace-nowrap px-2">
                {searchData.app.searchText}
              </div>
            ) : (
              <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                <div className="text-14 font-medium">
                  {t('list.BEDROOMS')}: {searchData.app.bedRooms}, {t('list.BUDGET')}: {searchData.app.monthlyRent}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="hidden sm:flex sm:w-1/2 2xl:w-2/5 justify-end pt-4">
        <NavBar darkHeader={false} />
        <Home darkHeader={false} />
        <WishList darkHeader={false} />
        <Auth darkHeader={false} />
        <CurrencyLanguageBar darkHeader={false} />
      </div>
      {visibleMobileSearchBar && (
        <div className="absolute left-0 top-0 w-full bg-white px-4 py-6">
          <Close
            className="w-close absolute right-4 top-6"
            onClick={() => {
              setVisibleMobileSearchBar(false);
            }}
          />
          <div className="text-16 font-bold text-black text-center">{t('list.EDIT_YOUR_SEARCH')}</div>
          <div
            className={cls([
              'mt-6 p-2 rounded-lg border border-solid border-dark border-opacity-30',
              styles.mobileSearch,
            ])}
          >
            <div className="flex justify-between">
              <div className={cls(['', isSearchPages() ? 'w-full' : 'w-1/2'])}>
                <CustomAutocomplete defaultRefinement={searchData.app.searchText} />
                <div className="pl-4">
                  <SearchByBedRooms
                    label={''}
                    attribute="property.beds"
                    defaultRefinement={{ min: minQuantity, max: maxQuantity }}
                    min={minQuantity}
                    max={maxQuantity}
                    translations={{ submit: 'ok', separator: 'to' }}
                  />
                </div>
              </div>
              {!isSearchPages() && (
                <div className="w-1/2 flex justify-end pr-4">
                  <div
                    className="mt-4 w-24 h-12 flex pt-3 bg-black cursor-pointer justify-center rounded-20"
                    onClick={sendSearch}
                  >
                    <div className="text-white text-14 font-medium">{t('home.SEARCH')}</div>
                  </div>
                </div>
              )}
            </div>
            <SearchByMonthlyRent
              attribute="amount"
              defaultRefinement={{ min: minQuantity, max: maxMonthlyRent }}
              min={minQuantity}
              max={maxMonthlyRent}
              translations={{ submit: 'ok', separator: 'to' }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default ListHeader;
