import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import MainSlider from '~/components/Screens/MainSlider';
import { Hit } from '~/components/Screens/AutoComplete';
import { ROUTES } from '~/utils/routes';
import { cls, getPrice } from '~/utils/functions';
import styles from './HomePost.module.css';
import { useRouter } from 'next/router';
import Apartment from '~/public/icons/apartment.svg';
import Map from '~/public/icons/map.svg';
import ChatBox from '~/components/Screens/ChatBox';
import Bed from '~/public/icons/bed.svg';
import Bath from '~/public/icons/bath.svg';
import { State } from '~/store/state';
import { useSelector } from 'react-redux';

interface HomePostProps {
  hit: Hit;
}

const HomePost: FC<HomePostProps> = (props: HomePostProps) => {
  const { hit } = props;
  const router = useRouter();
  const searchData = useSelector<State, State>(state => state);

  const isProfile = () => {
    return router.pathname === ROUTES.PROFILE;
  };

  return (
    <Container
      className={cls(['relative rounded-lg', isProfile() ? 'p-2' : 'bg-white p-4', isProfile() ? '' : styles.homeWrap])}
    >
      {isProfile() && (
        <div className="absolute top-4 left-4 text-white bg-auth text-10 px-3 py-1.5 rounded-lg z-10">
          11.11.2021 - 11.12.2021
        </div>
      )}
      <MainSlider mainSliders={hit.imageNames} navigation={false} />
      <div className={cls(['pl-2 z-10 w-full absolute -mt-10 flex justify-between', isProfile() ? 'pr-6' : 'pr-10'])}>
        <div className="flex h-7 mt-1">
          <div className="flex text-12 font-bold bg-black bg-opacity-60 text-white rounded-lg py-1.5 px-2 mr-1.5">
            <Bed className="text-white w-5 h-5 mr-2 -mt-0.5" />
            {hit.property.beds}
          </div>
          <div className="flex text-12 font-bold bg-black bg-opacity-60 text-white rounded-lg py-1.5 px-2">
            <Bath className="text-white w-5 h-5 mr-2 -mt-0.5" />
            {hit.property.baths}
          </div>
        </div>
        <div className="text-12 font-medium bg-white py-1.5 px-2 rounded-lg uppercase">
          <span className="font-bold">
            {getPrice(hit.amount, searchData.app.rates[searchData.app.currency.toUpperCase()])}
          </span>{' '}
          {searchData.app.currency}/m
        </div>
      </div>
      {!isProfile() && (
        <div className="flex justify-between py-6">
          <div className="text-14 font-medium text-black">
            <div className="flex mb-1">
              <div className="flex text-14 font-medium capitalize">
                <Apartment className="mr-2 -mt-1" />
                {hit.property.propertyType}
              </div>
            </div>
            <div className="flex mb-1 mt-4">
              <div className="flex text-14 font-medium capitalize">
                <Map className="mr-2 -mt-0.5" />
                {hit.property.building.district}
              </div>
            </div>
          </div>
          <ChatBox />
        </div>
      )}
    </Container>
  );
};

export default HomePost;
