import React, { FC, useState } from 'react';
// import { Marker, CustomMarker } from 'react-instantsearch-dom-maps';
import { CustomMarker } from 'react-instantsearch-dom-maps';
import { cls } from '~/utils/functions';
import styles from './GeoHit.module.css';
import { useSelector } from 'react-redux';
import { State } from '~/store/state';
import { Hit } from '~/components/Screens/AutoComplete';

interface GeoHitProps {
  hit: Hit;
}

const GeoHit: FC<GeoHitProps> = (props: GeoHitProps) => {
  const { hit } = props;

  const searchData = useSelector<State, State>(state => state);
  const [visibleInfoWindow, setVisibleInfoWindow] = useState(false);

  const showInfoWindow = () => {
    setVisibleInfoWindow(true);
  };

  const hideInfoWindow = () => {
    setVisibleInfoWindow(false);
  };

  return (
    <CustomMarker key={hit.objectID} hit={hit}>
      <div className="relative">
        {(visibleInfoWindow || searchData.app.selectedHitID === hit.objectID) && (
          <div className="absolute bg-white p-2 rounded-lg -top-16 -left-10">
            <div className="flex">
              <img src={hit.imageNames[0]} className="w-10 h-10 object-cover rounded mr-2" />
              <div className="pt-1.5 text-12">
                <div className="font-bold mb-1">{hit.amount}</div>
                <div>{hit.amountCurrency}/M</div>
              </div>
            </div>
          </div>
        )}
        <i
          className={cls(['fa fa-map-marker text-20 text-red', styles.markerIcon])}
          onMouseOver={showInfoWindow}
          onMouseOut={hideInfoWindow}
        ></i>
      </div>
    </CustomMarker>
  );
};

export default GeoHit;
