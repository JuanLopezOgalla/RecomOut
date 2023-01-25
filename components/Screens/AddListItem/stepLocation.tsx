import React, { useEffect, useState } from 'react';
import { cls } from '~/utils/functions';
import { Form, Input, Select, Divider, FormInstance, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-export-i18n';
import { getCities, getCountries } from '~/utils/functions';
import { defaultCities, defaultStates } from '~/utils/constants';
import Geocode from 'react-geocode';
import { useMutation, useQuery } from '@apollo/client';
import { BUILDINGS_QUERY, COMMUTIES_QUERY, CREATE_BUILDING_MUTATION, CREATE_COMMUNITY_MUTATION } from '~/utils/graphql';
import { GEOLOCATION } from '../CustomMap';
const { Option } = Select;

export type Community = {
  id: number;
  name: string;
};

export type Building = {
  id?: number;
  name: string;
  country: string;
  city: string;
  state: string;
  district: string;
  zip: string;
  address: string;
  buildingNumber: string;
  locationLat: number;
  locationLng: number;
  communityId: number;
  isActive: boolean;
};

const StepLocation = ({
  isActive,
  handleLocation,
  form,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  form: FormInstance;
  handleLocation: (location: GEOLOCATION) => void;
  handleBack: () => void;
  handleNext: () => void;
}) => {
  const { t } = useTranslation();
  const [communities, setCommunities] = useState<Array<Community>>([]);
  const [buildings, setBuildings] = useState<Array<Building>>([]);
  const [cities, setCities] = useState<string[]>();
  const communitiesResponse = useQuery(COMMUTIES_QUERY);
  const buildingsResponse = useQuery(BUILDINGS_QUERY);
  const [newCommunity, setNewCommunity] = useState<string>();
  const [newBuilding, setNewBuilding] = useState<Building>(null);
  const [community, setCommunity] = useState(0);
  const [building, setBuilding] = useState(0);

  const activeNewItemOnSelectBox = (index: number, content: string) => {
    const locationObjects = document.getElementsByClassName('ant-select-selector');
    const locationPlaceholders = locationObjects[index].querySelector<HTMLElement>('.ant-select-selection-placeholder');
    let locationSelectionItem = locationObjects[index].querySelector<HTMLElement>('.ant-select-selection-item');

    if (locationPlaceholders) locationPlaceholders.style.display = 'none';

    if (locationSelectionItem) {
      locationSelectionItem.innerHTML = content;
    } else {
      let newCommunityElement = document.createElement('span');

      newCommunityElement.setAttribute('class', 'ant-select-selection-item custom-selection-item');
      newCommunityElement.innerHTML = content;
      locationObjects[index].append(newCommunityElement);
    }

    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  };

  const [createCommunity] = useMutation(CREATE_COMMUNITY_MUTATION, {
    update: (_, mutationResult) => {
      setCommunities([...communities, { id: mutationResult.data.createCommunity.id, name: newCommunity }]);
      setCommunity(mutationResult.data.createCommunity.id);
      activeNewItemOnSelectBox(3, newCommunity);
      setNewCommunity('');
    },
  });

  const [createBuilding] = useMutation(CREATE_BUILDING_MUTATION, {
    update: (_, mutationResult) => {
      setBuilding(mutationResult.data.createBuilding.id);
      setBuildings([...buildings, { id: mutationResult.data.createBuilding.id, ...newBuilding }]);
      activeNewItemOnSelectBox(4, newBuilding?.name);
      setNewBuilding(null);
    },
  });

  const filterBuildings = (country: string, city: string, state: string, community: number) => {
    const filteredResult =
      community === 0
        ? buildingsResponse.data?.getBuildings.data.filter(
            building => building.country === country && building.city === city && building.state === state
          )
        : buildingsResponse.data?.getBuildings.data.filter(
            building =>
              building.country === country &&
              building.city === city &&
              building.state === state &&
              building.communityId === community
          );

    setBuildings(filteredResult);
  };

  useEffect(() => {
    setCities(defaultCities);
  }, []);

  useEffect(() => {
    if (communitiesResponse.data) {
      setCommunities(communitiesResponse.data.getCommunities.data);
    }
  }, [communitiesResponse.data]);

  useEffect(() => {
    if (buildingsResponse.data) {
      filterBuildings(
        form.getFieldValue('country'),
        form.getFieldValue('city'),
        form.getFieldValue('state'),
        form.getFieldValue('community')
      );
    }
  }, [buildingsResponse.data]);

  const handleCountry = (country: string) => {
    setCities(getCities(country));
    filterBuildings(
      form.getFieldValue('country'),
      form.getFieldValue('city'),
      form.getFieldValue('state'),
      form.getFieldValue('community')
    );
  };

  const getLocationFromAddress = async (address: string) => {
    try {
      const geoLocResponse = await Geocode.fromAddress(address);

      handleLocation(geoLocResponse.results[0].geometry.location);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCity = async (city: string) => {
    const address = `${city} ${form.getFieldValue('country')}`;

    filterBuildings(
      form.getFieldValue('country'),
      form.getFieldValue('city'),
      form.getFieldValue('state'),
      form.getFieldValue('community')
    );
    await getLocationFromAddress(address);
  };

  const handleCommunities = () => {
    filterBuildings(
      form.getFieldValue('country'),
      form.getFieldValue('city'),
      form.getFieldValue('state'),
      form.getFieldValue('community')
    );
  };

  const handleState = () => {
    filterBuildings(
      form.getFieldValue('country'),
      form.getFieldValue('city'),
      form.getFieldValue('state'),
      form.getFieldValue('community')
    );
  };

  const handleNewCommunity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCommunity(e.target.value);
  };

  const addNewCommunity = () => {
    if (newCommunity && newCommunity.length > 0) {
      createCommunity({ variables: { name: newCommunity } });
    }
  };

  const handleNewBuilding = (e: React.ChangeEvent<HTMLInputElement>) => {
    const building = {
      name: e.target.value,
      country: '',
      city: '',
      state: '',
      district: '',
      zip: '',
      address: '',
      buildingNumber: '',
      locationLat: 0,
      locationLng: 0,
      communityId: 0,
      isActive: true,
    };

    setNewBuilding(building);
  };

  const addNewBuilding = async () => {
    if (newBuilding && newBuilding.name.length > 0) {
      const geocodeResult = await Geocode.fromAddress(`${form.getFieldValue('city')} ${form.getFieldValue('country')}`);
      const { lat, lng } = geocodeResult.results[0].geometry.location;
      const newBuildingVar = {
        name: newBuilding?.name,
        address: '123 Street 456',
        country: form.getFieldValue('country') as string,
        city: form.getFieldValue('city') as string,
        state: form.getFieldValue('state') as string,
        district: '5',
        zip: '500',
        buildingNumber: '123',
        communityId: form.getFieldValue('community') as number,
        locationLat: lat as number,
        locationLng: lng as number,
        isActive: true,
      };

      setNewBuilding(newBuildingVar);

      createBuilding({
        variables: newBuildingVar,
      });
    }
  };

  const onNext = async () => {
    const address = `${form.getFieldValue('city')} ${form.getFieldValue('country')}`;

    getLocationFromAddress(address);
    handleNext();
  };

  return (
    <div
      className={cls([
        'h-photoGallery overflow-y-auto w-full flex flex-col justify-center items-center px-4 lg:px-0 lg:w-sellProperty',
        isActive ? 'block' : 'hidden',
      ])}
    >
      <div className="md:hidden text-24 md:text-32 text-black md:text-white font-bold w-full mb-4 md:pl-12">
        {t('home.LOCATION')}
      </div>
      <div className="w-full mt-6">
        <Form.Item label="" name="country">
          <Select showSearch placeholder={t('post.COUNTRY')} onChange={handleCountry}>
            {getCountries().map((country, key) => (
              <Option value={country.name} key={key}>
                {country.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className="w-full mt-6">
        <Form.Item label="" name="state">
          <Select showSearch placeholder={t('post.STATE')} onChange={handleState}>
            {defaultStates &&
              defaultStates.map((state, key) => (
                <Option value={state} key={key}>
                  {state}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </div>
      <div className="w-full mt-6">
        <Form.Item label="" name="city">
          <Select showSearch placeholder={t('post.CITY')} onChange={handleCity}>
            {cities &&
              cities.map((city, key) => (
                <Option value={city} key={key}>
                  {city}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </div>
      <div className="w-full mt-6">
        <Form.Item label="" name="community">
          <Select
            showSearch
            value={community}
            placeholder={t('post.COMMUNITY')}
            onChange={handleCommunities}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input style={{ flex: 'auto' }} value={newCommunity} onChange={handleNewCommunity} />
                  <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={addNewCommunity}
                  >
                    <PlusOutlined /> {t('post.ADD_COMMUNITY')}
                  </a>
                </div>
              </div>
            )}
          >
            {communities.map((community, key) => (
              <Option value={community.id} key={key}>
                {community.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className="w-full mt-6 building">
        <Form.Item label="" name="building">
          <Select
            showSearch
            value={building}
            placeholder={t('item.BUILDING')}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input style={{ flex: 'auto' }} value={newBuilding?.name} onChange={handleNewBuilding} />
                  <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={addNewBuilding}
                  >
                    <PlusOutlined /> {t('post.ADD_BUILDING')}
                  </a>
                </div>
              </div>
            )}
          >
            {buildings?.map(
              (building, key) =>
                building && (
                  <Option value={building.id} key={key}>
                    {building.name}
                  </Option>
                )
            )}
          </Select>
        </Form.Item>
      </div>
      <div className="handleWrap absolute bottom-0 w-full border-t border-solid border-black border-opacity-10">
        <div className="px-4 md:px-12 py-6 flex justify-between">
          <Button type="default" onClick={handleBack}>
            {t('post.BACK')}
          </Button>

          <Button type="primary" onClick={onNext}>
            {t('post.NEXT')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepLocation;
