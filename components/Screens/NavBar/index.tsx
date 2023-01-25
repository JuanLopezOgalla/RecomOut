import React, { FC } from 'react';
import { ROUTES } from '~/utils/routes';
import Link from 'next/link';
import { cls } from '~/utils/functions';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useRouter } from 'next/router';

interface NavBarProps {
  darkHeader: boolean;
}

const NavBar: FC<NavBarProps> = (props: NavBarProps) => {
  const { darkHeader } = props;
  const [query] = useLanguageQuery();
  const { t } = useTranslation();
  const router = useRouter();

  const mainMenu = [
    {
      title: t('header.HOME_MENU_BECOME_AN_AGENT'),
      href: ROUTES.AGENT,
      active: router.pathname === ROUTES.AGENT,
    },
    {
      title: t('header.SELL_YOUR_PROPERTY'),
      href: ROUTES.PROPERTIES,
      active: router.pathname === ROUTES.PROPERTIES,
    },
  ];

  return (
    <nav className={cls(['hidden', router.pathname === ROUTES.HOME ? 'sm:flex' : 'lg:flex'])}>
      {mainMenu.map((el, key) => (
        <Link href={{ pathname: el.href, query }} key={key}>
          <a
            className={cls([
              'px-4 pt-2.5 text-12 hover:font-bold text-ellipsis overflow-hidden whitespace-nowrap',
              darkHeader ? 'text-white hover:text-white' : 'text-black hover:text-white',
              el.href === '/properties' || el.href === '/agent'
                ? 'h-9 pt-2 -mt-0.5 capitalize rounded-lg bg-black text-white ml-4'
                : '',
            ])}
          >
            {el.title}
          </a>
        </Link>
      ))}
    </nav>
  );
};

export default NavBar;
