import React from 'react';
import Container from '~/components/Screens/Container';
import { useTranslation } from 'next-export-i18n';
import { NextSeo } from 'next-seo';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <Container className="profileContainer pt-24 bg-listBackground flex justify-center pb-20 border-b border-solid border-black border-opacity-10">
      <NextSeo title="RECOM Terms and Privacy" description="RECOM Terms and Privacy." />
      <div className="w-full sm:w-newProperty px-4 sm:px-0 text-14 text-justify text-black">
        <div className="text-32 text-center font-bold mt-4 mb-2">{t('privacy.TITLE')}</div>
        <p className="text-14 text-justify">
          {t('privacy.PARAGRAPH1PART1')} <a href="/">https://recom.estate</a>, {t('privacy.PARAGRAPH1PART2')}
        </p>
        <p>{t('privacy.PARAGRAPH2')}</p>
        <p>
          {t('privacy.PARAGRAPH3')} <a href="https://www.privacypolicygenerator.info/">{t('privacy.PARAGRAPH31')}</a>.
        </p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE1')}</div>
        <p>{t('privacy.PARAGRAPH4')}</p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE2')}</div>
        <p>{t('privacy.PARAGRAPH5')}</p>
        <p>{t('privacy.PARAGRAPH6')}</p>
        <p>{t('privacy.PARAGRAPH7')}</p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE3')}</div>
        <p>{t('privacy.PARAGRAPH8')}</p>
        <ul className="list-disc pl-4">
          <li>{t('privacy.LIST1')}</li>
          <li>{t('privacy.LIST2')}</li>
          <li>{t('privacy.LIST3')}</li>
          <li>{t('privacy.LIST4')}</li>
          <li>{t('privacy.LIST5')}</li>
          <li>{t('privacy.LIST6')}</li>
          <li>{t('privacy.LIST7')}</li>
        </ul>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE4')}</div>
        <p>{t('privacy.PARAGRAPH9')}</p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE5')}</div>
        <p>{t('privacy.PARAGRAPH10')}</p>
        <p>
          {t('privacy.PARAGRAPH11')}{' '}
          <a href="https://www.generateprivacypolicy.com/#cookies">{t('privacy.PARAGRAPH111')}</a>.
        </p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE6')}</div>
        <p>{t('privacy.PARAGRAPH12')}</p>
        <p>{t('privacy.PARAGRAPH13')}</p>
        <p>{t('privacy.PARAGRAPH14')}</p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE7')}</div>
        <p>{t('privacy.PARAGRAPH15')}</p>
        <p>{t('privacy.PARAGRAPH16')}</p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE8')}</div>
        <p>{t('privacy.PARAGRAPH17')}</p>
        <p>{t('privacy.PARAGRAPH18')}</p>
        <p>{t('privacy.PARAGRAPH19')}</p>
        <p>{t('privacy.PARAGRAPH20')}</p>
        <p>{t('privacy.PARAGRAPH21')}</p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE9')}</div>
        <p>{t('privacy.PARAGRAPH22')}</p>
        <p>{t('privacy.PARAGRAPH23')}</p>
        <p>{t('privacy.PARAGRAPH24')}</p>
        <p>{t('privacy.PARAGRAPH25')}</p>
        <p>{t('privacy.PARAGRAPH26')}</p>
        <p>{t('privacy.PARAGRAPH27')}</p>
        <p>{t('privacy.PARAGRAPH28')}</p>
        <p>{t('privacy.PARAGRAPH21')}</p>
        <div className="text-18 text-auth">{t('privacy.SUBTITLE10')}</div>
        <p>{t('privacy.PARAGRAPH29')}</p>
        <p>{t('privacy.PARAGRAPH30')}</p>
      </div>
    </Container>
  );
};

export default Privacy;
