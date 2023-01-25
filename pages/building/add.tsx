import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '~/components/Screens/Container';
import CustomMap, { GEOLOCATION } from '~/components/Screens/CustomMap';
import { CREATE_BUILDING_MUTATION, COMMUTIES_QUERY } from '~/utils/graphql';
import { Form, Input, Button, Select } from 'antd';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { getCountries, getCities } from '~/utils/functions';
import { defaultCities, defaultStates, defaultCountry } from '~/utils/constants';
import { useQuery, useMutation } from '@apollo/client';
import { ROUTES } from '~/utils/routes';
import { firebase } from '~/utils/firebase';
import { COUNTRIES } from '../listing/add';
import { useDispatch } from 'react-redux';
import { setFbToken } from '~/store/app/actions';
import { NextSeo } from 'next-seo';
import Geocode from 'react-geocode';

export type Building = {
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
};

export type Community = {
  id: number;
  name: string;
};

const NewBuilding = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { Option } = Select;

  Geocode.setApiKey(GOOGLE_MAPS_API_KEY);

  const communities = useQuery(COMMUTIES_QUERY);

  const [countries, setCountries] = useState<Array<COUNTRIES>>([]);
  const [cities, setCities] = useState(defaultCities);
  const [city, setCity] = useState(defaultCities[0]);
  const [country, setCountry] = useState(defaultCountry);
  const [location, setLocation] = useState<GEOLOCATION>(null);
  const [isLoading, setLoading] = useState(false);
  const [newBuilding, setNewBuilding] = useState<Building>(null);

  const [newBuildingLink] = useMutation(CREATE_BUILDING_MUTATION, {
    variables: newBuilding,
    update: () => {
      router.push(`${ROUTES.BUILDING}?lang=${query.lang}`);
    },
    onError: err => {
      if (err.message.includes('Firebase ID token has expired')) {
        getNewToken();
      }
    },
  });

  useEffect(() => {
    const initData = async () => {
      setCountries(await getCountries());
      getGeoCode(city + ' ' + country);
    };

    initData();
  }, []);

  const getGeoCode = (address: string) => {
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;

        setLocation({ lat: lat, lng: lng });
      },
      error => {
        console.error(error);
      }
    );
  };

  const getNewToken = () => {
    firebase
      .auth()
      .currentUser?.getIdToken(true)
      .then(idToken => {
        dispatch(setFbToken(idToken));
        router.reload();
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  const handleCountry = async (value: string) => {
    setCountry(value);
    setCities(await getCities(value));
  };

  const handleCity = (value: string) => {
    setCity(value);
    getGeoCode(value + ' ' + country);
  };

  const handleLocation = (location: GEOLOCATION) => {
    setLocation(location);
  };

  const onFinish = (values: Building) => {
    setLoading(true);

    try {
      values.locationLat = location.lat;
      values.locationLng = location.lng;

      setNewBuilding({ ...values });
      newBuildingLink();
    } catch (e) {
      console.log(e, 'error');

      getNewToken();
    }
  };

  return (
    <Container className="propertyContainer buildingContainer bg-listBackground pb-12">
      <NextSeo title="RECOM Add Building" description="Add building of RECOM." />
      <div className="w-full lg:flex">
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center pt-28">
          <div className="flex justify-center items-center">
            <div className="w-full lg:w-sellProperty">
              <CustomMap
                city={city}
                country={country}
                location={location}
                handleLocation={handleLocation}
                autoSearch={false}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center pt-4 lg:pt-28">
          <div className="w-full lg:w-sellProperty">
            <div className="mt-8 flex justify-between">
              <h1 className="text-32 text-item font-bold">{t('building.NEW_BUILDING')}</h1>
            </div>
            <div className="mt-4">
              <Form
                name="properties"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{ country: defaultCountry, city: defaultCities[0], communityId: 2 }}
              >
                <div className="mt-4">
                  <Form.Item
                    label={t('building.NAME')}
                    name="name"
                    rules={[{ required: true, message: t('building.REQUIRED_NAME') }]}
                  >
                    <Input type="text" size="large" placeholder={t('building.NAME')} />
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('post.COMMUNITY')} name="communityId">
                    <Select showSearch placeholder={t('post.COMMUNITY')}>
                      {communities.data &&
                        communities.data.getCommunities.data.map((community, key) => (
                          <Option value={community.id} key={key}>
                            {community.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('post.COUNTRY')} name="country">
                    <Select showSearch placeholder={t('post.COUNTRY')} onChange={handleCountry}>
                      {countries.map((country, key) => (
                        <Option value={country.name} key={key}>
                          {country.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item
                    label={t('post.STATE')}
                    name="state"
                    rules={[{ required: true, message: t('building.REQUIRED_STATE') }]}
                  >
                    <Select showSearch placeholder={t('post.STATE')}>
                      {defaultStates &&
                        defaultStates.map((state, key) => (
                          <Option value={state} key={key}>
                            {state}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('post.CITY')} name="city">
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
                <div className="mt-4">
                  <Form.Item
                    label={t('building.DISTRICT')}
                    name="district"
                    rules={[{ required: true, message: t('building.REQUIRED_DISTRICT') }]}
                  >
                    <Input type="text" size="large" placeholder={t('building.DISTRICT')} />
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item
                    label={t('building.ZIP')}
                    name="zip"
                    rules={[{ required: true, message: t('building.REQUIRED_ZIP') }]}
                  >
                    <Input type="text" size="large" placeholder={t('building.ZIP')} />
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item
                    label={t('building.ADDRESS')}
                    name="address"
                    rules={[{ required: true, message: t('building.REQUIRED_ADDRESS') }]}
                  >
                    <Input type="text" size="large" placeholder={t('building.ADDRESS')} />
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item
                    label={t('building.BUILDING_NUMBER')}
                    name="buildingNumber"
                    rules={[{ required: true, message: t('building.REQUIRED_BUILDING_NUMBER') }]}
                  >
                    <Input type="text" size="large" placeholder={t('building.BUILDING_NUMBER')} />
                  </Form.Item>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t('listing.SAVE')}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NewBuilding;
