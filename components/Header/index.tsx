import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Header.module.css';
import { cls } from '~/utils/functions';
import Logo from '~/components/Screens/Logo';
import NavBar from '~/components/Screens/NavBar';
import Auth from '~/components/AuthNav';
import Home from '~/components/HomeNav';
import CurrencyLanguageBar from '~/components/Screens/CurrencyLanguageBar';
import WishList from '~/components/Screens/WishList';
import MobileNav from '~/components/MobileNav';
import SearchWrap from '~/components/SearchWrap';
import SimpleSearch from '~/components/Screens/SimpleSearch';
import { ROUTES } from '~/utils/routes';

const Header: FC = () => {
  const router = useRouter();

  const [darkHeader, setDarkHeader] = useState(true);
  const [activeSearch, setActiveSearch] = useState(false);

  useEffect(() => {
    const closePopup = () => {
      setActiveSearch(false);
    };

    if (isHome()) {
      document.getElementById('mainwrap').addEventListener('click', closePopup);
      document.getElementById('searchwrap').addEventListener('click', closePopup);
      document.getElementById('footer').addEventListener('click', closePopup);
    }
  }, []);

  useEffect(() => {
    if (isHome()) {
      setDarkHeader(true);
      window.onscroll = () => {
        if (window.pageYOffset > 10) setDarkHeader(false);
        else {
          setDarkHeader(true);
          setActiveSearch(false);
        }
      };
    } else setDarkHeader(false);
  }, [router.pathname]);

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  const handleSearchBox = () => {
    setActiveSearch(true);
  };

  return (
    <header
      className={cls([
        styles.header,
        'flex justify-between fixed z-20 w-full py-4 px-6 sm:pl-4 sm:pr-4 lg:px-20 h-20 sm:h-header',
        darkHeader ? 'sm:pt-16' : styles.defaultHeader,
      ])}
    >
      <div className="hidden sm:flex">
        <Logo linkTo="/" darkHeader={darkHeader} />
      </div>
      <div className={cls(['hidden sm:flex z-10', !darkHeader ? 'pt-4' : ''])}>
        <NavBar darkHeader={darkHeader} />
        <Home darkHeader={darkHeader} />
        <WishList darkHeader={darkHeader} />
        <Auth darkHeader={darkHeader} />
        <CurrencyLanguageBar darkHeader={darkHeader} />
      </div>
      <MobileNav darkHeader={darkHeader} />
      {!darkHeader && !activeSearch && <SimpleSearch handleSearchBox={handleSearchBox} />}
      <SearchWrap darkHeader={darkHeader} activeSearch={activeSearch} />
    </header>
  );
};

export default Header;
