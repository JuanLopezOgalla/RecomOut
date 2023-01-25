import React, { FC, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import GoogleMapIcon from '~/public/icons/googlemap.svg';
import { mapStyles } from '~/utils/constants';
import AutoPlaceSearch from '~/components/AutoPlaceSearch';

interface ContainerProps {
  city: string;
  country: string;
  location: GEOLOCATION;
  autoSearch: boolean;
  handleLocation(location: GEOLOCATION): void;
}

export interface GEOLOCATION {
  lat: number;
  lng: number;
}

const CustomMap: FC<ContainerProps> = (props: ContainerProps) => {
  const { location, handleLocation } = props;

  const [draggableMarker, setDraggableMarker] = useState(true);
  const [apiHeaderLoaded, setApiHeaderLoaded] = useState(false);
  const [autoSearchLocation, setAutoSearchLocation] = useState(`${props.city} - ${props.country}`);

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleMap = (obj: { lat: number; lng: number }) => {
    handleLocation({ lat: obj.lat, lng: obj.lng });
  };

  const LocationPin = () => {
    return (
      <div className="pin">
        <GoogleMapIcon className="googleMapIcon" />
      </div>
    );
  };

  const googleMapMouseDown = (childKey: string, childProps: string, mouse: { lat: number; lng: number }) => {
    console.log(childKey, childProps);
    handleLocation({ lat: mouse.lat, lng: mouse.lng });
    setDraggableMarker(false);
  };

  const googleMapMouseUp = () => {
    setDraggableMarker(true);
  };

  return (
    <div className="postMap">
      {apiHeaderLoaded && props.autoSearch && (
        <AutoPlaceSearch
          onPlaceSelected={place => {
            handleMap({ lat: place.lat, lng: place.lng });
          }}
          address={autoSearchLocation}
          onLocation={searchLocation => {
            setAutoSearchLocation(searchLocation);
          }}
        />
      )}
      {!props.autoSearch && (
        <div className="text-16 text-black font-bold mb-4">{`${props.city}, ${props.country}`}</div>
      )}
      {location && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
          defaultCenter={location}
          center={location}
          defaultZoom={16}
          options={{
            styles: mapStyles,
          }}
          onClick={handleMap}
          draggable={draggableMarker}
          onChildMouseDown={googleMapMouseDown}
          onChildMouseUp={googleMapMouseUp}
          onChildMouseMove={googleMapMouseDown}
          onGoogleApiLoaded={() => setApiHeaderLoaded(true)}
        >
          <LocationPin />
        </GoogleMapReact>
      )}
    </div>
  );
};

export default CustomMap;
