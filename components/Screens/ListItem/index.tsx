import React, { FC } from 'react';
import MainSlider from '~/components/Screens/MainSlider';
import { Hit } from '~/components/Screens/AutoComplete';
import { cls, getPrice, getTitleFromHit } from '~/utils/functions';
import styles from './ListItem.module.css';
import Apartment from '~/public/icons/apartment.svg';
import Map from '~/public/icons/map.svg';
import ChatBox from '~/components/Screens/ChatBox';
import Bed from '~/public/icons/bed.svg';
import Bath from '~/public/icons/bath.svg';
import AmenityItem from '~/components/Screens/AmenityItem';
import { ROUTES } from '~/utils/routes';
import { useDispatch, useSelector } from 'react-redux';
import { setHit, setSearchText, setSelectedHitID } from '~/store/app/actions';
import { useRouter } from 'next/router';
import { useLanguageQuery } from 'next-export-i18n';
import { State } from '~/store/state';

interface ListItemProps {
  hit: Hit;
}

const ListItem: FC<ListItemProps> = (props: ListItemProps) => {
  const { hit } = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const [query] = useLanguageQuery();
  const searchData = useSelector<State, State>(state => state);

  const handleHit = () => {
    dispatch(setHit(hit));
    dispatch(setSearchText(getTitleFromHit(hit)));
    router.push(`${ROUTES.ITEM}?lang=${query.lang}`);
  };

  const handleOver = (id: string) => {
    dispatch(setSelectedHitID(id));
  };

  const handleOut = () => {
    dispatch(setSelectedHitID(''));
  };

  return (
    <div
      className={cls(['bg-white p-4 relative rounded-lg sm:flex cursor-pointer', styles.homeWrap])}
      onClick={handleHit}
      onMouseOver={() => {
        handleOver(hit.objectID);
      }}
      onMouseOut={handleOut}
    >
      <div className="w-full sm:w-60 truncate h-full sm:h-44">
        <MainSlider mainSliders={hit.imageNames} navigation={false} />
      </div>
      <div className={cls(['sm:pl-6 pt-4 sm:pt-2 w-full', styles.mainInfo])}>
        <div className="flex justify-between">
          <div className="w-5/7 text-18 font-bold text-listTitle uppercase max-h-14 overflow-hidden">
            {hit.description}
          </div>
          <div className="w-2/7 text-20 font-bold text-listTitle uppercase text-right leading-7">
            <span className="font-bold">
              {getPrice(hit.amount, searchData.app.rates[searchData.app.currency.toUpperCase()])}
            </span>
            <span className="font-normal text-16">{searchData.app.currency}/M</span>
          </div>
        </div>
        <div className="flex mt-4">
          <div className="flex text-14 font-medium capitalize">
            <Apartment className="mr-2 -mt-1" />
            {hit.property.propertyType}
          </div>
          <div className="ml-4 flex text-14 font-medium capitalize">
            <Map className="mr-2 -mt-0.5" />
            {hit.property.building.district}
          </div>
        </div>
        <div className="flex mt-4">
          <div className="flex text-12 font-bold mr-4 font-bold">
            <Bed className="text-listIcon w-5 h-5 mr-2 -mt-0.5" />
            {hit.property.beds}
          </div>
          <div className="flex text-12 font-bold font-bold">
            <Bath className="text-listIcon w-5 h-5 mr-2 -mt-0.5" />
            {hit.property.baths}
          </div>
        </div>
        <div className="flex justify-between pt-3">
          <div className="flex">
            {hit.property.amentities &&
              hit.property.amentities.map(amenity => (
                <div className="mr-4">
                  <AmenityItem amenity={amenity} />
                </div>
              ))}
          </div>
          <div className="-mt-4">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
