import React, { FC } from 'react';
import Link from 'next/link';
import Container from '~/components/Screens/Container';
import { ROUTES } from '~/utils/routes';
import { useLanguageQuery } from 'next-export-i18n';
import { useRouter } from 'next/router';
import LogoIcon from '~/public/icons/logo.svg';
import LogoList from '~/public/icons/logo-list.svg';
import { cls } from '~/utils/functions';
import styles from './Logo.module.css';

interface LogoProps {
  linkTo: string;
  darkHeader: boolean;
}

const Logo: FC<LogoProps> = (props: LogoProps) => {
  const { linkTo, darkHeader } = props;
  const [query] = useLanguageQuery();
  const router = useRouter();

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  const isListingAdd = () => {
    return router.pathname === ROUTES.LISTING_ADD;
  };

  return (
    <Container className={cls([isHome() ? 'lg:mr-48' : 'lg:mr-12', darkHeader ? '-mt-2' : ''])}>
      <Link href={{ pathname: linkTo, query: { lang: query && query.lang } }}>
        <a className="flex">
          {!darkHeader ? (
            <LogoIcon className={cls(['w-40 mt-1', styles.logo, isListingAdd() && 'mt-6'])} />
          ) : (
            <LogoList className={cls(['w-40 mt-1', styles.logo])} />
          )}
        </a>
      </Link>
    </Container>
  );
};

export default Logo;
