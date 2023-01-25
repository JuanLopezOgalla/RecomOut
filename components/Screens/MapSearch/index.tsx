import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import { GoogleMapsLoader, GeoSearch } from 'react-instantsearch-dom-maps';
import GeoHit from '~/components/Screens/GeoHit';

const MapSearch: FC = () => {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <Container className="h-full">
      <GoogleMapsLoader apiKey={GOOGLE_MAPS_API_KEY}>
        {google => (
          <GeoSearch google={google} enableRefine={false}>
            {({ hits }) => (
              <div>
                {hits.map(hit => (
                  <GeoHit hit={hit} />
                ))}
              </div>
            )}
          </GeoSearch>
        )}
      </GoogleMapsLoader>
    </Container>
  );
};

export default MapSearch;
