import React, { FC, useState, useEffect } from 'react';
import Container from '~/components/Screens/Container';
import { useDispatch } from 'react-redux';
import { setSearchText, setPrevSearchText } from '~/store/app/actions';
import { useTranslation } from 'next-export-i18n';
import { useRouter } from 'next/router';
import { cls } from '~/utils/functions';
import styles from './AutoComplete.module.css';
import { ROUTES } from '~/utils/routes';

export interface Hit {
  id: number;
  objectID: string;
  amount: number;
  amountCurrency: string;
  amountType: string;
  description: string;
  isActive: boolean;
  listingType: string;
  imageNames: string[];
  property: HitProperty;
}

export interface HitProperty {
  id: number;
  unitNumber: string;
  propertyType: string;
  amentities: string[];
  attributes: string[];
  baths: number;
  beds: number;
  sqft: number;
  buildingId: number;
  communityId: number;
  building: HitBuilding;
}

export interface HitBuilding {
  address: string;
  city: string;
  buildingNumber: string;
  country: string;
  district: string;
  name: string;
  state: string;
  zip: string;
  community: HitCommunity;
  id: number;
}

export interface HitCommunity {
  id: number;
  name: string;
}

interface AutoCompleteProps {
  refine: (value: string) => void;
  currentRefinement: string;
  hits: Hit[];
  nextStep?: () => void;
}

const AutoComplete: FC<AutoCompleteProps> = (props: AutoCompleteProps) => {
  const { hits, currentRefinement, refine, nextStep } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchTexts, setSearchTexts] = useState<string>(currentRefinement);
  const [visiblePreview, setVisiblePreview] = useState(false);

  useEffect(() => {
    const closePopup = e => {
      if (e.target.classList[0] !== 'searchItem') setVisiblePreview(false);
    };

    document.body.addEventListener('click', closePopup);
  }, []);

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  const handleSearchText = e => {
    setVisiblePreview(true);
    setSearchTexts(e.currentTarget.value);
    if (e.currentTarget.value === '') {
      dispatch(setSearchText(e.currentTarget.value));
      dispatch(setPrevSearchText(e.currentTarget.value));
    }

    refine(e.currentTarget.value);
  };

  const getUnique = (hits: Hit[]) => {
    let filteredHits = [];

    filteredHits.push(hits[0]);

    for (let i = 1; i < hits.length; i++) {
      let duplicated = false;

      for (let j = 0; j < filteredHits.length; j++) {
        if (
          hits[j].property.building.city === hits[i].property.building.city &&
          hits[j].property.building.country === hits[i].property.building.country
        ) {
          duplicated = true;
          break;
        }
      }
      if (!duplicated) filteredHits.push(hits[i]);
    }

    return filteredHits;
  };

  const changeSearchText = (hit: Hit) => {
    const value = `${hit.property.building.country}, ${hit.property.building.city}`;

    setVisiblePreview(false);
    setSearchTexts(value);
    dispatch(setSearchText(value));
    dispatch(setPrevSearchText(value));
    refine(value);
    if (window.innerWidth < 640 && isHome()) {
      nextStep();
    }
  };

  return (
    <Container className="w-full">
      <input
        type="search"
        className="searchItem searchText text-14 w-full bg-transparent px-4 py-2.5 font-medium"
        placeholder={isHome() ? t('home.SEARCH_TEXT') : t('home.LOCATION')}
        value={searchTexts}
        onChange={handleSearchText}
        onClick={() => {
          setVisiblePreview(true);
        }}
      />
      <ul
        className={cls([
          'searchItem bg-white px-6 pt-6 pb-4 text-black font-bold text-14 overflow-y-auto absolute sm:relative top-4 sm:top-0 z-20',
          isHome()
            ? 'w-full mt-8 rounded-lg sm:rounded-20 -left-0'
            : 'w-calc8 sm:w-full mt-16 sm:mt-4 z-10000 rounded-lg left-4 top-16 h-48',
          isHome() ? '' : styles.shadowWrap,
          styles.homeList,
          hits.length && searchTexts !== '' && visiblePreview ? 'block' : 'hidden',
        ])}
        id="autoCompleteBoard"
      >
        {getUnique(hits).map(hit => {
          if (hit)
            return (
              <li
                key={hit.objectID}
                className="searchItem mb-2 cursor-pointer font-bold flex"
                onClick={() => {
                  changeSearchText(hit);
                }}
              >
                <i className="fa fa-map-marker text-black text-opacity-30 mr-2 mt-0.5"></i>
                <div>
                  {hit.property.building.country}, {hit.property.building.city}
                </div>
              </li>
            );
        })}
      </ul>
    </Container>
  );
};

export default AutoComplete;
