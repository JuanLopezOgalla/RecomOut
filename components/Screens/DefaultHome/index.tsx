import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import { Hit } from '~/components/Screens/AutoComplete';

interface DefaultHomeProps {
  hits: Hit[];
}

const DefaultHome: FC<DefaultHomeProps> = (props: DefaultHomeProps) => {
  const { hits } = props;

  const getUnique = (hits: Hit[]) => {
    let filteredHits = [];

    filteredHits.push(hits[0]);

    for (let i = 1; i < hits.length; i++) {
      let duplicated = false;

      for (let j = 0; j < filteredHits.length; j++) {
        if (
          hits[j].property.building.city === hits[i].property.building.city &&
          hits[j].property.building.district === hits[i].property.building.district
        ) {
          duplicated = true;
          break;
        }
      }
      if (!duplicated) filteredHits.push(hits[i]);
    }

    return filteredHits;
  };

  return (
    <Container className="absolute top-14 text-14 font-bold">
      {hits.length ? (
        <ul className="">
          {getUnique(hits).map(hit => (
            <li key={hit.district} className="searchItem mb-2 cursor-pointer">
              {hit.property.building.district}, {hit.property.building.city}
            </li>
          ))}
        </ul>
      ) : (
        ''
      )}
    </Container>
  );
};

export default DefaultHome;
