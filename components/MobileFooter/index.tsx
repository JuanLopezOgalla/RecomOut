import React, { FC } from 'react';
import Link from 'next/link';
import Container from '~/components/Screens/Container';
import Auth from '~/components/AuthNav';
import CurrencyLanguageBar from '~/components/Screens/CurrencyLanguageBar';
import WishList from '~/components/Screens/WishList';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { State } from '~/store/state';
import { ROUTES } from '~/utils/routes';
import { cls } from '~/utils/functions';
import styles from './MobileFooter.module.css';

const MobileFooter: FC = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const searchData = useSelector<State, State>(state => state);
  const router = useRouter();

  const isListingAdd = () => {
    return router.pathname === ROUTES.LISTING_ADD;
  };

  return (
    <Container
      className={cls([
        'sm:hidden fixed left-0 bottom-0 w-full bg-white z-50 flex justify-center h-20 px-4',
        styles.mobileFooter,
        isListingAdd() && (searchData.app.visibleMobileFooter ? 'block' : 'hidden'),
      ])}
    >
      <Link href={{ pathname: ROUTES.HOME, query }}>
        <div className="w-1/5 text-center pt-4">
          <i className={cls(['fa fa-search mt-0.5 text-searchBox', styles.magnifyIcon])}></i>
          <div className="capitalize text-12 mt-1">{t('header.HOME_MENU_RENT')}</div>
        </div>
      </Link>
      <Link href={{ pathname: ROUTES.AGENT, query }}>
        <div className="w-1/5 text-center pt-4">
          <i className={cls(['fa fa-plus mt-0.5 text-searchBox', styles.magnifyIcon])}></i>
          <div className="capitalize text-12 mt-1">{t('header.HOME_MENU_LIST')}</div>
        </div>
      </Link>
      <div className="w-1/5 text-center pt-4">
        <div className="flex justify-center">
          <WishList darkHeader={false} />
        </div>
        <div className="capitalize text-12 mt-1">{t('header.WISHLIST')}</div>
      </div>
      <div className="w-1/5 text-center pt-4">
        <Auth darkHeader={false} />
        {/* <div className="capitalize text-12 mt-1">{t('header.LOGIN')}</div> */}
      </div>
      <div className="w-1/5 text-center pt-3">
        <CurrencyLanguageBar darkHeader={false} />
      </div>
    </Container>
  );
};

export default MobileFooter;
