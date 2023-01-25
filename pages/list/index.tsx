import React, { useEffect, useState } from 'react';
import Container from '~/components/Screens/Container';
import FilterBar from '~/components/Screens/FilterBar';
import ListSearch from '~/components/ListSearch';
import MapSearch from '~/components/Screens/MapSearch';
import { Menu } from 'react-instantsearch-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText } from '~/store/app/actions';
import { State } from '~/store/state';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

const List = () => {
  const dispatch = useDispatch();
  const searchData = useSelector<State, State>(state => state);
  const router = useRouter();

  const [visibleExclusive, setVisibleExclusive] = useState(false);

  useEffect(() => {
    dispatch(setSearchText(searchData.app.prevSearchText));

    if (router.query.exclusive && router.query.exclusive === 'true') setVisibleExclusive(true);
  }, []);

  return (
    <Container className="listContainer mainContainer pt-28 pb-24 sm:pb-6 bg-listBackground xl:flex">
      <NextSeo title="RECOM Item List" description="RECOM Item List." />
      {visibleExclusive && (
        <div className="hidden">
          <Menu attribute="exclusive" defaultRefinement="true" />
        </div>
      )}
      <div className="xl:hidden pt-4 -mt-6">
        <FilterBar />
      </div>
      <Container className="xl:hidden w-full xl:w-3/7 mt-2 sm:px-8 px-4">
        <MapSearch />
      </Container>
      <Container className="pt-8 xl:pt-0 w-full xl:w-4/7">
        <div className="hidden xl:block mb-4">
          <FilterBar />
        </div>
        <ListSearch />
      </Container>
      <Container className="hidden xl:block w-full xl:w-3/7 mt-6 sm:mt-0 pr-8">
        <MapSearch />
      </Container>
    </Container>
  );
};

export default List;
