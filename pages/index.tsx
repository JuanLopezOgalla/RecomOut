import React, { FC, useEffect } from 'react';
import styles from './main.module.css';
import Container from '~/components/Screens/Container';
import RecentSearch from '~/components/RecentSearch';
import { ROUTES } from '~/utils/routes';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setMonthlyRent, setBedRooms, setSearchText, setPrevSearchText } from '~/store/app/actions';
import { Button } from 'antd';
import { minQuantity, maxMonthlyRent } from '~/utils/constants';
import { NextSeo } from 'next-seo';

const Index: FC = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  const algolia_client_id = process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID;
  const algolia_client_secret = process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_SECRET;
  const algolia_index_name = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
  const searchClient = algoliasearch(algolia_client_id, algolia_client_secret);

  useEffect(() => {
    dispatch(setMonthlyRent(maxMonthlyRent));
    dispatch(setBedRooms(minQuantity));
    dispatch(setSearchText(''));
    dispatch(setPrevSearchText(''));

    if (query) router.push(`${ROUTES.HOME}?lang=${query.lang}`);
  }, []);

  const handleSeeMore = () => {
    router.push(`${ROUTES.LIST}/?lang=${query.lang}&exclusive=true`);
  };

  return (
    <Container className="mainContainer">
      <NextSeo title="RECOM Website" description="Find your home." />
      <Container className="relative">
        <img src="/images/home-background.jpg" className="h-screen w-full object-cover" alt="" />
        <div className={styles.searchWraper} id="mainwrap">
          <h1 className="mt-52 leading-none text-40 md:text-52 px-4 text-center sm:text-left font-bold text-white">
            {t('home.TITLE')}
          </h1>
        </div>
        <InstantSearch indexName={algolia_index_name} searchClient={searchClient}>
          <div className="pt-12 pb-20 -mt-40 sm:-mt-52 bg-dark" id="searchwrap">
            <h3 className="text-center -mb-4 sm:mb-8 text-32 text-white font-bold">{t('home.FEATURED_SEARCH')}</h3>
            <RecentSearch hitsPerPage={5} />
            <div className="seeMore mt-6 pl-12">
              <Button type="primary" onClick={handleSeeMore}>
                {t('home.SEE_MORE')} <i className="fa fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </div>
        </InstantSearch>
      </Container>
    </Container>
  );
};

export default Index;
