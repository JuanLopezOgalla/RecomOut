import React, { useEffect, useRef, useState } from 'react';
import { GEOLOCATION } from '../Screens/CustomMap';

let autoComplete;

function handleScriptLoad(updateQuery, autoCompleteRef, onLocation) {
  autoComplete = new (window as any).google.maps.places.SearchBox(autoCompleteRef.current);

  autoComplete.addListener('places_changed', () => {
    handlePlaceSelect(updateQuery, onLocation);
  });
}

async function handlePlaceSelect(updateQuery, onLocation) {
  const places = autoComplete.getPlaces();

  if (places && places.length > 0) {
    onLocation(places[0].name);
    updateQuery({ lat: places[0].geometry.location.lat(), lng: places[0].geometry.location.lng() });
  }
}

const AutoPlaceSearch = ({
  address,
  onPlaceSelected,
  onLocation,
}: {
  address: string;
  onPlaceSelected: (location: GEOLOCATION) => void;
  onLocation: (searchLocation: string) => void;
}) => {
  const autoCompleteRef = useRef(null);
  const [location, setLocation] = useState(address);

  useEffect(() => {
    handleScriptLoad(onPlaceSelected, autoCompleteRef, onLocation);
  }, []);

  const handleLocation = (e: { target: { value: string } }) => {
    setLocation(e.target.value);
  };

  useEffect(() => {
    setLocation(address);
  }, [address]);

  return (
    <input
      className="text-14 text-black mb-4 pl-4 py-3 border border-black text-bold border-solid border-opacity-10 rounded-lg w-full"
      ref={autoCompleteRef}
      placeholder="Enter a City"
      value={location}
      onChange={handleLocation}
    />
  );
};

export default AutoPlaceSearch;
