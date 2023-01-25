import React, { FC, useState, useEffect } from 'react';
import { LanguageSwitcher, useLanguageQuery } from 'next-export-i18n';
import Container from '~/components/Screens/Container';
import { ROUTES } from '~/utils/routes';
import { cls, getRates } from '~/utils/functions';
import styles from './CurrencyLanguageBar.module.css';
import { useTranslation } from 'next-export-i18n';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency, setRates } from '~/store/app/actions';
import { State } from '~/store/state';
import { CURRENCY } from '~/store/app';
import { DEFAULT_CURRENCY } from '~/utils/constants';
import En from '~/public/icons/en.svg';
import Ar from '~/public/icons/ar.svg';
import Hi from '~/public/icons/hi.svg';
import Ge from '~/public/icons/ge.svg';
import CN from '~/public/icons/cn.svg';
import RU from '~/public/icons/ru.svg';

const CURRENCIES = [
  { value: 'eur', label: 'EUR' },
  { value: 'aed', label: 'AED' },
  { value: 'cny', label: 'CNY' },
  { value: 'sar', label: 'SAR' },
  { value: 'usd', label: 'USD' },
  { value: 'rub', label: 'RUB' },
];

interface CurrencyLanguageBarProps {
  darkHeader: boolean;
}

const CurrencyLanguageBar: FC<CurrencyLanguageBarProps> = (props: CurrencyLanguageBarProps) => {
  const { darkHeader } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchData = useSelector<State, State>(state => state);
  const [query] = useLanguageQuery();
  const languages = [
    {
      value: 'en',
      label: t('language.ENGLISH'),
      flag: '/images/en.png',
      icon: <En className="w-8 h-8 sm:w-6 sm:h-6 border border-solid border-white rounded-full" />,
    },
    {
      value: 'ge',
      label: t('language.GERMAN'),
      flag: '/images/ge.png',
      icon: <Ge className="w-8 h-8 sm:w-6 sm:h-6 border border-solid rounded-full" />,
    },
    {
      value: 'ar',
      label: t('language.ARABIC'),
      flag: '/images/ar.png',
      icon: <Ar className="w-10 h-10 sm:w-8 sm:h-8 -mt-1 border border-solid border-white rounded-full" />,
    },
    {
      value: 'hi',
      label: t('language.HINDI'),
      flag: '/images/hi.png',
      icon: <Hi className="w-8 h-8 sm:w-6 sm:h-6 border border-solid border-white rounded-full" />,
    },
    {
      value: 'cn',
      label: t('language.CHINESE'),
      flag: '/images/cn.png',
      icon: <CN className="w-8 h-8 sm:w-6 sm:h-6 bg-yellow border border-solid border-white rounded-full" />,
    },
    {
      value: 'ru',
      label: t('language.RUSSIAN'),
      flag: '/images/ru.png',
      icon: <RU className="w-8 h-8 sm:w-6 sm:h-6 border border-solid border-white rounded-full" />,
    },
  ];
  const currentLanguage = languages.find(el => el.value === query?.lang);

  const [visibleNav, setVisibleNav] = useState(false);

  useEffect(() => {
    const closePopup = () => {
      setVisibleNav(false);
    };

    document.body.addEventListener('click', closePopup);

    const handleRates = async () => {
      dispatch(setCurrency(DEFAULT_CURRENCY));
      dispatch(setRates(await getRates(DEFAULT_CURRENCY)));
    };

    if (!searchData.app.rates) handleRates();
  }, []);

  const toggleNav = () => {
    setVisibleNav(value => !value);
  };

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  const handleCurrency = async (currency: CURRENCY) => {
    setVisibleNav(true);

    dispatch(setCurrency(currency));
    dispatch(setRates(await getRates(DEFAULT_CURRENCY)));
  };

  return (
    <Container className={cls(['flex justify-center relative sm:pl-3 sm:ml-1', styles.languageBar])}>
      <div
        className={cls(['flex cursor-pointer', styles.flag, darkHeader ? 'text-white' : 'text-black'])}
        onClick={toggleNav}
      >
        {currentLanguage?.icon}
        <div className="hidden sm:block text-12 ml-2 sm:mt-1">{currentLanguage?.label}</div>
        <i
          className={cls([
            'fa fa-caret-down ml-2 mt-1 sm:mt-0 text-searchBox',
            darkHeader ? 'sm:text-white' : 'sm:text-black text-opacity-80',
          ])}
        ></i>
      </div>
      <div
        className={cls([
          'absolute rounded bottom-16 -left-32 sm:bottom-auto w-52 p-4 bg-white shadowwrap flex',
          darkHeader ? 'sm:mt-8' : isHome() ? 'sm:mt-14' : 'sm:mt-10',
          isHome() ? 'sm:-left-6' : 'sm:-left-18',
          visibleNav ? 'block' : 'hidden',
        ])}
        onClick={toggleNav}
      >
        <div className="mr-4">
          <div className="text-14 text-black font-medium pb-2 border-b border-black border-solid border-opacity-10 mb-4 capitalize">
            {t('header.CURRENCY')}
          </div>
          <ul className="m-0">
            {CURRENCIES.map(el => (
              <li key={el.value} onClick={() => handleCurrency(el.value as CURRENCY)} className="cursor-pointer py-2">
                {el.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-14 text-black font-medium pb-2 border-b border-black border-solid border-opacity-10 mb-4 capitalize">
            {t('header.LANGUAGE')}
          </div>
          <ul className="m-0">
            {languages.map(el => (
              <li key={el.value} className="cursor-pointer py-2">
                <LanguageSwitcher lang={el.value} key={el.value}>
                  <div className="flex">
                    <img className={styles.smallFlag} onClick={toggleNav} src={el.flag} />
                    <div className="ml-2">{el.label}</div>
                  </div>
                </LanguageSwitcher>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default CurrencyLanguageBar;
