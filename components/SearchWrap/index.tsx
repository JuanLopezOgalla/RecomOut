import React, { FC } from 'react';
import styles from './SearchWrap.module.css';
import Container from '~/components/Screens/Container';
import { ROUTES } from '~/utils/routes';
import AutoComplete from '~/components/Screens/AutoComplete';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { cls } from '~/utils/functions';
import { connectAutoComplete } from 'react-instantsearch-dom';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '~/store/state';
import { setSearchType } from '~/store/app/actions';

interface SearchWrapProps {
  darkHeader: boolean;
  activeSearch: boolean;
}

enum SEARCHTYPE {
  BUY = 'buy',
  RENT = 'rent',
}

const SearchWrap: FC<SearchWrapProps> = (props: SearchWrapProps) => {
  const { darkHeader, activeSearch } = props;

  const router = useRouter();
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const searchData = useSelector<State, State>(state => state);
  const dispatch = useDispatch();

  const CustomAutocomplete = connectAutoComplete(AutoComplete);

  const sendSearch = () => {
    router.push(`${ROUTES.LIST}?lang=${query.lang}`);
  };

  const handleSearchType = (type: string) => {
    dispatch(setSearchType(type));
  };

  return (
    <Container
      className={cls([
        'hidden sm:block',
        styles.searchBox,
        darkHeader ? '' : styles.searchBoxDefault,
        !activeSearch ? '' : styles.searchBoxActivate,
      ])}
    >
      <div className="flex mb-2 pl-4">
        <div
          className={cls([
            'text-14 font-medium rounded-2xl text-center w-20 h-10 pt-2.5 capitalize mr-2 cursor-pointer',
            searchData.app.searchType === SEARCHTYPE.BUY ? 'text-white bg-auth' : 'text-black bg-white',
          ])}
          onClick={() => handleSearchType(SEARCHTYPE.BUY)}
        >
          {t('home.BUY')}
        </div>
        <div
          className={cls([
            'text-14 font-medium rounded-2xl text-center w-20 h-10 pt-2.5 capitalize cursor-pointer',
            searchData.app.searchType === SEARCHTYPE.RENT ? 'text-white bg-auth' : 'text-black bg-white',
          ])}
          onClick={() => handleSearchType(SEARCHTYPE.RENT)}
        >
          {t('home.RENT')}
        </div>
      </div>
      <div className="bg-white bg-opacity-90 p-4 rounded-32 boxShadowWrap">
        <div className="grid grid-cols-4 gap-1 relative">
          <div className="lg:mt-0 col-span-3 h-14">
            <div className="text-14 font-semibold pl-4 text-black">{t('home.LOCATION')}</div>
            <CustomAutocomplete />
          </div>
          <div className="h-14 flex pt-4 bg-black cursor-pointer justify-center rounded-20" onClick={sendSearch}>
            <div className="text-white text-14 font-medium">{t('home.SEARCH')}</div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SearchWrap;
