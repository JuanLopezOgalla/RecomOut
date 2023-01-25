import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import AmenityItem from '~/components/Screens/AmenityItem';

interface AmenityContainerProps {
  amenities: string[];
  label: string;
}

const AmenityContainer: FC<AmenityContainerProps> = (props: AmenityContainerProps) => {
  const { amenities, label } = props;

  return (
    <Container className="mt-4 mb-6">
      <div className="text-16 text-item font-bold">{label}</div>
      <div className="flex mt-4">
        {amenities &&
          amenities.map((amenity, key) => (
            <div className="mr-8 w-16" key={key}>
              <div className="flex justify-center">
                <AmenityItem amenity={amenity} />
              </div>
              <div className="mt-4 text-10 text-black font-bold text-center">{amenity}</div>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default AmenityContainer;
