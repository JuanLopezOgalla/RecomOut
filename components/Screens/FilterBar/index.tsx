import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import MenuSelect from '~/components/Screens/MenuSelect';
import { connectMenu } from 'react-instantsearch-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAmenity, setPropertyType } from '~/store/app/actions';
import { State } from '~/store/state';

const FilterBar: FC = () => {
  const dispatch = useDispatch();

  const searchData = useSelector<State, State>(state => state);

  const CustomMenuSelect = connectMenu(MenuSelect);

  const changeAmenity = (value: string) => {
    dispatch(setAmenity(value));
  };

  const changePropertyType = (value: string) => {
    dispatch(setPropertyType(value));
  };

  return (
    <Container className="px-4 sm:px-8 xl:px-12 sm:flex">
      {/* <RefinementList attribute="amenities.title" /> */}
      <CustomMenuSelect
        attribute="property.amenities"
        searchItem="amenities"
        changeValue={changeAmenity}
        searchValue={searchData.app.amenity}
      />
      <CustomMenuSelect
        attribute="property.propertyType"
        searchItem="propertyType"
        changeValue={changePropertyType}
        searchValue={searchData.app.propertyType}
      />
    </Container>
  );
};

export default FilterBar;
