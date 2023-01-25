import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import IncDecInput from '~/components/Screens/IncDecInput';
import SliderRange from '~/components/Screens/SliderRange';
import { connectRange } from 'react-instantsearch-dom';
import { useTranslation } from 'next-export-i18n';
import { minQuantity, maxQuantity, maxMonthlyRent } from '~/utils/constants';

const DetailedSearch: FC = () => {
  const { t } = useTranslation();

  const SearchByBedRooms = connectRange(IncDecInput);
  const SearchByMonthlyRent = connectRange(SliderRange);

  return (
    <Container>
      <Container className="flex justify-left">
        <div className="text-14 font-bold mr-4 w-1/6 pt-3">{t('home.ROOMS')}: </div>
        <SearchByBedRooms
          attribute="property.beds"
          defaultRefinement={{ min: 0, max: 10 }}
          min={minQuantity}
          max={maxQuantity}
          translations={{ submit: 'ok', separator: 'to' }}
        />
      </Container>
      <Container className="flex justify-left mt-4">
        <div className="text-14 font-bold mr-4 w-1/6 pt-3">{t('list.BUDGET')}: </div>
        <SearchByMonthlyRent
          attribute="amount"
          defaultRefinement={{ min: 0, max: 100000 }}
          min={minQuantity}
          max={maxMonthlyRent}
          translations={{ submit: 'ok', separator: 'to' }}
        />
      </Container>
    </Container>
  );
};

export default DetailedSearch;
