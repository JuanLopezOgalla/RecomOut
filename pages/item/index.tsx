import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import MainSlider from '~/components/Screens/MainSlider';
import MapSearch from '~/components/Screens/MapSearch';
import ApartmentSpec from '~/components/Screens/ApartmentSpec';
import QuickNav from '~/components/QuickNav';
import ContactTab from '~/components/ContactTab';
import Bed from '~/public/icons/bed.svg';
import Bath from '~/public/icons/bath.svg';
import AmenityContainer from '~/components/Screens/AmenityContainer';
import { useSelector } from 'react-redux';
import { State } from '~/store/state';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import styles from './Item.module.css';
import { cls, getPrice, getTitleFromHit } from '~/utils/functions';
import { NextSeo } from 'next-seo';
import { ROUTES } from '~/utils/routes';
import { useRouter } from 'next/router';
import { Button } from 'antd';

const Item: FC = () => {
  const { t } = useTranslation();

  const searchData = useSelector<State, State>(state => state);
  const hit = searchData.app.hit;
  const router = useRouter();
  const [query] = useLanguageQuery();

  const gotoPayment = () => {
    router.push(`${ROUTES.PAYMENT}/?lang=${query.lang}&exclusive=true`);
  };

  return (
    hit && (
      <Container className="itemContainer pt-24 px-4 sm:px-12 xl:px-52 bg-listBackground">
        <NextSeo title="RECOM Item Detail" description="RECOM Item Detail." />
        <div className="mt-4">
          <QuickNav label={`${hit.property.building.district}, ${hit.property.building.city}`} />
        </div>
        <div className={cls(['mt-6 rounded-xl overflow-hidden', styles.mainSlider])}>
          <MainSlider mainSliders={hit.imageNames} navigation={true} />
        </div>
        <div className="mt-12">
          <div className="md:flex justify-between">
            <div className="w-full md:w-1/2">
              <div className="text-20 text-listTitle font-bold">{getTitleFromHit(hit)}</div>
              <div className="mt-8">
                <div className="text-20 text-item font-bold">{t('item.APARTMENT_SPECS')}</div>
                <div className="flex mt-4 flex-wrap">
                  <ApartmentSpec
                    icon={<Bed className="text-listIcon w-8 h-8" />}
                    title={t('list.BEDROOMS')}
                    value={hit.property.beds}
                    type="item"
                  />
                  <ApartmentSpec
                    icon={<Bath className="text-listIcon w-8 h-8" />}
                    title={t('item.BATHROOMS')}
                    value={hit.property.baths}
                    type="item"
                  />
                </div>
              </div>
              <div className="mt-8">
                <div className="text-20 text-item font-bold">{t('item.AMENITIES')}</div>
                <AmenityContainer amenities={hit.property.amentities} label={t('item.BUILDING')} />
                <AmenityContainer amenities={hit.property.amentities} label={t('item.PROPERTY')} />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-4 mt-8 md:mt-0 lg:pl-16 space-y-4 grid justify-items-stretch">
              <div className={cls(['px-6 py-8 bg-white rounded-xl', styles.connectModal])}>
                <div className="flex justify-between border-b border-solid border-black border-opacity-10 pb-2">
                  <div className="text-20 text-item font-bold pt-2 pr-2">{t('list.BUDGET')}</div>
                  <div className="text-24 text-budget font-medium uppercase">
                    <span className="font-bold">
                      {hit && getPrice(hit.amount, searchData.app.rates[searchData.app.currency.toUpperCase()])}
                    </span>
                    <span className="text-20 text-currency">{searchData.app.currency}/M</span>
                  </div>
                </div>
                <div className="pt-8">
                  <ContactTab />
                </div>
              </div>
              <Button className="justify-self-center" size={'large'} onClick={gotoPayment}>
                {t('item.RENT_NOW')}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-20 pb-20 border-b border-solid border-black border-opacity-10">
          <MapSearch />
        </div>
      </Container>
    )
  );
};

export default Item;
