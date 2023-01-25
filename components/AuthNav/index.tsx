import React, { FC, useState, Fragment, useEffect } from 'react';
import AuthContainer from '~/components/AuthContainer';
import { ROUTES } from '~/utils/routes';
import User from '~/public/icons/users.svg';
import { useRouter } from 'next/router';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { cls } from '~/utils/functions';
import { State } from '~/store/state';
import { useSelector, useDispatch } from 'react-redux';
import { setFbRefreshToken, setUser, setFbToken } from '~/store/app/actions';

interface AuthNavProps {
  darkHeader: boolean;
}

const AuthNav: FC<AuthNavProps> = (props: AuthNavProps) => {
  const { darkHeader } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const searchData = useSelector<State, State>(state => state);
  const dispatch = useDispatch();

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

  const goProfile = () => {
    router.push(`${ROUTES.PROFILE}?lang=${query.lang}`);
  };

  const goSubscription = () => {
    router.push(`${ROUTES.SUBSCRIPTION}?lang=${query.lang}`);
  };

  const handleAuth = () => {
    setVisibleAuthModal(true);
  };

  const logout = () => {
    dispatch(setUser(null));
    dispatch(setFbToken(''));
    dispatch(setFbRefreshToken(''));

    router.push(`${ROUTES.HOME}?lang=${query.lang}`);
  };

  return (
    <Fragment>
      <a className={cls(['mt-1.5 sm:mt-0 sm:ml-3 flex sm:block justify-center'])} onClick={toggleNav}>
        <User
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
        <li
          onClick={goProfile}
          className="cursor-pointer py-2 text-black font-medium capitalize border-b border-solid border-black border-opacity-10 text-left"
        >
          {t('header.PROFILE')}
        </li>
        <li
          onClick={goSubscription}
          className="cursor-pointer py-2 text-black font-medium capitalize border-b border-solid border-black border-opacity-10 text-left"
        >
          {t('header.SUBSCRIPTION')}
        </li>
        <li onClick={logout} className="cursor-pointer py-2 text-14 text-black font-medium capitalize text-left">
          {t('header.LOGOUT')}
        </li>
      </ul>
      {visibleAuthModal && <AuthContainer hideModal={hideModal} />}
    </Fragment>
  );
};

export default AuthNav;
