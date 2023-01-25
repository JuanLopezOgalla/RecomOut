import React, { FC } from 'react';
import { ROUTES } from '~/utils/routes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import LogoIcon from '~/public/icons/logo.svg';
import LogoList from '~/public/icons/logo-list.svg';
import AppStore from '~/public/icons/app-store.svg';
import GooglePlay from '~/public/icons/google-play.svg';
import Facebook from '~/public/icons/facebook.svg';
import Linkedin from '~/public/icons/linkedin.svg';
import Instagram from '~/public/icons/instagram.svg';
import Youtube from '~/public/icons/youtube.svg';
import Twitter from '~/public/icons/twitter.svg';
import { cls } from '~/utils/functions';
import {
  CAREER_LINK,
  HELP_CENTER_LINK,
  INSTAGRAM_LINK,
  FACEBOOK_LINK,
  LINKEDIN_LINK,
  TWITTER_LINK,
  YOUTUBE_LINK,
  APP_STORE_LINK,
  GOOGLE_PLAY_LINK,
} from '~/utils/constants';
import styles from './Footer.module.css';

const Footer: FC = () => {
  const [query] = useLanguageQuery();
  const { t } = useTranslation();
  const router = useRouter();

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  return (
    <footer
      className={cls(['px-12 pb-16 sm:pb-0', isHome() ? 'bg-dark text-white' : 'bg-listBackground text-itemFooter'])}
      id="footer"
    >
      <div className="py-10 border-t border-solid border-white border-opacity-20 xl:flex">
        <div className="sm:flex w-full xl:w-1/3 2xl:w-2/5">
          <div className="mt-2">
            <Link href={{ pathname: ROUTES.HOME, query }}>
              <a className="flex">
                {isHome() ? (
                  <LogoList className={cls(['w-40 -mt-1', styles.logo])} />
                ) : (
                  <LogoIcon className={cls(['w-40 -mt-1', styles.logo])} />
                )}
              </a>
            </Link>
            <Link href={{ pathname: ROUTES.PRIVACY, query }}>
              <div
                className={cls([
                  'mt-4 text-12 font-medium cursor-pointer pl-2',
                  isHome() ? styles.privacyTerms : 'text-itemFooter',
                ])}
              >
                © 2022 · Privacy · Terms
              </div>
            </Link>
          </div>
          <div className="sm:mx-4 mt-10 sm:mt-0">
            <div className="flex mt-3">
              <a href={APP_STORE_LINK}>
                <AppStore className="cursor-pointer mr-4 sm:mr-0 xl:mr-4" />
              </a>
              <a href={GOOGLE_PLAY_LINK}>
                <GooglePlay className="cursor-pointer" />
              </a>
            </div>
          </div>
        </div>
        <div className="xl:pl-16 md:flex w-full xl:w-2/3 2xl:w-3/5 justify-between pt-2 mt-8 xl:mt-0">
          <div className="sm:flex">
            <div className="mb-6 sm:mb-0 mr-6 lg:mr-10 2xl:mr-14">
              <div className="text-16 font-semibold">{t('footer.AGENTS_OWNER')}</div>
              <ul className="pt-3">
                <li className="cursor-pointer">
                  <Link href={{ pathname: ROUTES.AGENT, query }}>
                    <a className={cls(['text-12 font-medium', isHome() ? 'text-white' : 'text-itemFooter'])}>
                      {t('footer.LIST_PROPERTY_FOR_FREE')}
                    </a>
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href={{ pathname: ROUTES.PROPERTIES, query }}>
                    <a className={cls(['text-12 font-medium', isHome() ? 'text-white' : 'text-itemFooter'])}>
                      {t('header.SELL_YOUR_PROPERTY')}
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mb-6 sm:mb-0 mr-6 lg:mr-10 2xl:mr-14">
              <div className="text-16 font-semibold">{t('footer.COMPANY')}</div>
              <ul className="pt-3">
                <li className="cursor-pointer">
                  <a
                    href={CAREER_LINK}
                    className={cls(['text-12 font-medium', isHome() ? 'text-white' : 'text-itemFooter'])}
                    target="_blank"
                  >
                    {t('footer.CAREERS')}
                  </a>
                </li>
                <li className="cursor-pointer">
                  <Link href={{ pathname: ROUTES.HOME, query }}>
                    <a className={cls(['text-12 font-medium', isHome() ? 'text-white' : 'text-itemFooter'])}>
                      {t('footer.DEVELOPERS')}
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mb-6 sm:mb-0 mr-6 lg:mr-10 2xl:mr-14">
              <div className="text-16 font-semibold">{t('footer.SUPPORT')}</div>
              <ul className="pt-3">
                <li className="cursor-pointer">
                  <a
                    className={cls(['text-12 font-medium', isHome() ? 'text-white' : 'text-itemFooter'])}
                    href={HELP_CENTER_LINK}
                    target="_blank"
                  >
                    {t('footer.HELP_CENTER')}
                  </a>
                </li>
                <li className="cursor-pointer">
                  <Link href={{ pathname: ROUTES.CONTACT, query }}>
                    <a className={cls(['text-12 font-medium', isHome() ? 'text-white' : 'text-itemFooter'])}>
                      {t('footer.CONTACT')}
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mb-6 sm:mb-0 mr-6 lg:mr-10 2xl:mr-14">
              <div className="text-16 font-semibold">{t('footer.ABOUT')}</div>
              <ul className="pt-3">
                <li className="cursor-pointer">
                  <Link href={{ pathname: ROUTES.HOME, query }}>
                    <a className={cls(['text-12 font-medium', isHome() ? 'text-white' : 'text-itemFooter'])}>
                      {t('footer.NEWSROOM')}
                    </a>
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href={{ pathname: ROUTES.HOME, query }}>
                    <a className={cls(['text-12 font-medium', isHome() ? 'text-white' : 'text-itemFooter'])}>
                      {t('footer.PRESS_CENTER')}
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex md:justify-end mt-10 sm:mt-6">
            <a
              href={INSTAGRAM_LINK}
              className={cls(['rounded-full h-7', isHome() ? 'text-white' : 'text-itemFooter'])}
              target="_blank"
            >
              <Instagram />
            </a>
            <a
              href={FACEBOOK_LINK}
              className={cls(['rounded-full ml-4 h-7', isHome() ? 'text-white' : 'text-itemFooter'])}
            >
              <Facebook />
            </a>
            <a
              href={TWITTER_LINK}
              className={cls([
                'rounded-full ml-4 p-1.5 w-7 h-7',
                isHome() ? 'bg-socialIcon bg-opacity-50 text-white' : 'bg-socialIcon bg-opacity-10 text-itemFooter',
              ])}
            >
              <Twitter />
            </a>
            <a
              href={LINKEDIN_LINK}
              className={cls(['rounded-full ml-4 h-7', isHome() ? 'text-white' : 'text-itemFooter'])}
            >
              <Linkedin />
            </a>
            <a
              href={YOUTUBE_LINK}
              className={cls([
                'rounded-full ml-4 p-1.5 w-7 h-7',
                isHome() ? 'bg-socialIcon bg-opacity-50 text-white' : 'bg-socialIcon bg-opacity-10 text-itemFooter',
              ])}
            >
              <Youtube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
