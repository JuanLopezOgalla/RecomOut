import React, { FC, useState, Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import AuthContainer from '~/components/AuthContainer';
import { State } from '~/store/state';
import { ROLE } from '~/utils/constants';
import { cls } from '~/utils/functions';
import { ROUTES } from '~/utils/routes';
import Home from '~/public/icons/home.svg';

interface HomeNavProps {
  darkHeader: boolean;
}

const HomeNav: FC<HomeNavProps> = (props: HomeNavProps) => {
  const { darkHeader } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const searchData = useSelector<State, State>(state => state);

  const [visibleAuthModal, setVisibleAuthModal] = useState(false);
  const [visibleNav, setVisibleNav] = useState(false);

  useEffect(() => {
    const closePopup = () => {
      setVisibleNav(false);
    };

    document.body.addEventListener('click', closePopup);
  }, []);

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  const toggleNav = () => {
    if (searchData.app.user) setVisibleNav(value => !value);
    else handleAuth();
  };

  const hideModal = () => {
    setVisibleAuthModal(false);
  };

  const goLiveStream = () => {
    router.push(`${ROUTES.LIVE}?lang=${query.lang}`);
  };

  const handleAuth = () => {
    setVisibleAuthModal(true);
  };

  const goOverview = (page: string) => {
    router.push(`${page}?lang=${query.lang}`);
  };

  return (
    <Fragment>
      <a className={cls(['mt-1.5 sm:mt-0 sm:ml-3 flex sm:block justify-center'])} onClick={toggleNav}>
        <Home
          className={cls(['w-9 h-9 text-searchBox sm:w-8 sm:h-8', darkHeader ? 'sm:text-white' : 'sm:text-black'])}
        />
      </a>
      <ul
        className={cls([
          'absolute rounded-lg bottom-18 sm:bottom-auto mt-2 w-40 py-2 px-4 bg-white shadowwrap',
          darkHeader ? 'sm:mt-10' : isHome() ? 'sm:mt-16' : 'sm:mt-10',
          isHome() ? 'sm:right-28 lg:right-36' : 'sm:right-28 lg:right-24 2xl:right-28',
          visibleNav ? 'block' : 'hidden',
        ])}
      >
        {searchData.app.user &&
          (searchData.app.user.role === ROLE.ADMIN ||
            searchData.app.user.role === ROLE.OWNER ||
            searchData.app.user.role === ROLE.AGENT) && (
            <li
              onClick={() => {
                goOverview(ROUTES.COMMUNITY);
              }}
              className="cursor-pointer py-2 text-black font-medium capitalize border-b border-solid border-black border-opacity-10 text-left"
            >
              {t('header.COMMUNITIES')}
            </li>
          )}
        {searchData.app.user &&
          (searchData.app.user.role === ROLE.ADMIN ||
            searchData.app.user.role === ROLE.OWNER ||
            searchData.app.user.role === ROLE.AGENT) && (
            <li
              onClick={() => {
                goOverview(ROUTES.BUILDING);
              }}
              className="cursor-pointer py-2 text-black font-medium capitalize border-b border-solid border-black border-opacity-10 text-left"
            >
              {t('header.BUILDINGS')}
            </li>
          )}
        {searchData.app.user &&
          (searchData.app.user.role === ROLE.ADMIN ||
            searchData.app.user.role === ROLE.OWNER ||
            searchData.app.user.role === ROLE.AGENT) && (
            <li
              onClick={() => {
                goOverview(ROUTES.LISTING);
              }}
              className="cursor-pointer py-2 text-black font-medium capitalize border-b border-solid border-black border-opacity-10 text-left"
            >
              {t('header.LISTINGS')}
            </li>
          )}
        <li
          onClick={goLiveStream}
          className="cursor-pointer py-2 text-black font-medium capitalize border-b border-solid border-black border-opacity-10 text-left"
        >
          {t('header.LIVESTREAM')}
        </li>
      </ul>
      {visibleAuthModal && <AuthContainer hideModal={hideModal} />}
    </Fragment>
  );
};

export default HomeNav;
