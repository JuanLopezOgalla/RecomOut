import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '~/components/Screens/Container';
import CustomMap, { GEOLOCATION } from '~/components/Screens/CustomMap';
import { GET_BUILDING_QUERY, UPDATE_BUILDING_MUTATION } from '~/utils/graphql';
import { Form, Input, Button, Select } from 'antd';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { getCountries, getCities } from '~/utils/functions';
import { defaultCities, defaultStates } from '~/utils/constants';
import { useQuery, useMutation } from '@apollo/client';
import { ROUTES } from '~/utils/routes';
import { firebase } from '~/utils/firebase';
import { COUNTRIES } from '../listing/add';
import { useDispatch } from 'react-redux';
import { setFbToken } from '~/store/app/actions';
import { NextSeo } from 'next-seo';

export type LocationCoordinate = {
  type: string;
  coordinates: number[];
};

export type Building = {
  id: number;
  name: string;
  country: string;
  city: string;
  state: string;
  district: string;
  zip: string;
  address: string;
  buildingNumber: string;
  locationCoordinate: LocationCoordinate;
};

const BuildingDetail = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  const { Option } = Select;

  const [countries, setCountries] = useState<Array<COUNTRIES>>([]);
  const [cities, setCities] = useState(defaultCities);
  const [oldBuilding, setOldBuilding] = useState<Building>();
  const [building, setBuilding] = useState<Building>();

  const oldBuildingQuery = useQuery(GET_BUILDING_QUERY, {
    variables: oldBuilding,
  });

  const [updateBuildingLink] = useMutation(UPDATE_BUILDING_MUTATION, {
    variables: building,
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
    };

    initData();
  }, []);

  useEffect(() => {
    if (oldBuildingQuery.data) {
      setBuilding(oldBuildingQuery.data.getBuilding);
    }
  }, [oldBuildingQuery.data]);

  useEffect(() => {
    if (router.query.id) {
      const oldBuilding = {
        id: parseInt(router.query.id.toString()),
        name: '',
        country: '',
        city: '',
        state: '',
        district: '',
        zip: '',
        address: '',
        buildingNumber: '',
        locationCoordinate: { type: '', coordinates: [0, 0] },
      };

      setOldBuilding(oldBuilding);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (oldBuildingQuery.error && oldBuildingQuery.error.message.includes('Firebase ID token has expired')) {
      getNewToken();
    }
  }, [oldBuildingQuery.error]);

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

  const handleName = (e: { target: { value: string } }) => {
    setBuilding({ ...building, name: e.target.value });
  };

  const handleCountry = async (value: string) => {
    setBuilding({ ...building, country: value });
    setCities(await getCities(value));
  };

  const handleState = (value: string) => {
    setBuilding({ ...building, state: value });
  };

  const handleCity = (value: string) => {
    setBuilding({ ...building, city: value });
  };

  const handleZip = (e: { target: { value: string } }) => {
    setBuilding({ ...building, zip: e.target.value });
  };

  const handleAddress = (e: { target: { value: string } }) => {
    setBuilding({ ...building, address: e.target.value });
  };

  const handleBuildingNumber = (e: { target: { value: string } }) => {
    setBuilding({ ...building, buildingNumber: e.target.value });
  };

  const handleLocation = (location: GEOLOCATION) => {
    setBuilding({
      ...building,
      locationCoordinate: { ...building.locationCoordinate, coordinates: [location.lat, location.lng] },
    });
  };

  const handleDistrict = (e: { target: { value: string } }) => {
    setBuilding({ ...building, district: e.target.value });
  };

  const onFinish = () => {
    try {
      updateBuildingLink();
    } catch (e) {
      console.log(e, 'error');

      getNewToken();
    }
  };

  return (
    <Container className="propertyContainer buildingContainer bg-listBackground pb-12">
      <NextSeo title="RECOM Edit Building" description="Edit building of RECOM." />
      <div className="w-full lg:flex">
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center pt-28">
          <div className="flex justify-center items-center">
            <div className="w-full lg:w-sellProperty">
              {building && (
                <CustomMap
                  city={building.city}
                  country={building.country}
                  location={{
                    lat: building.locationCoordinate.coordinates[0],
                    lng: building.locationCoordinate.coordinates[1],
                  }}
                  autoSearch={false}
                  handleLocation={handleLocation}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center pt-4 lg:pt-28">
          <div className="w-full lg:w-sellProperty">
            <div className="mt-8 flex justify-between">
              <h1 className="text-32 text-item font-bold">{t('building.EDIT_BUILDING')}</h1>
            </div>
            <div className="mt-4">
              <Form
                name="properties"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <div className="mt-4">
                  <Form.Item label={t('building.NAME')} name="name">
                    {building && <Input type="text" size="large" defaultValue={building.name} onChange={handleName} />}
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('post.COUNTRY')} name="country">
                    {building && (
                      <Select
                        showSearch
                        placeholder={t('post.COUNTRY')}
                        onChange={handleCountry}
                        defaultValue={building.country}
                      >
                        {countries.map((country, key) => (
                          <Option value={country.name} key={key}>
                            {country.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('post.STATE')} name="state">
                    {building && (
                      <Select
                        showSearch
                        placeholder={t('post.STATE')}
                        onChange={handleState}
                        defaultValue={building.state}
                      >
                        {defaultStates &&
                          defaultStates.map((state, key) => (
                            <Option value={state} key={key}>
                              {state}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('post.CITY')} name="city">
                    {building && (
                      <Select
                        showSearch
                        placeholder={t('post.CITY')}
                        onChange={handleCity}
                        defaultValue={building.city}
                      >
                        {cities &&
                          cities.map((city, key) => (
                            <Option value={city} key={key}>
                              {city}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('post.DISTRICT')} name="district">
                    {building && (
                      <Input type="text" size="large" defaultValue={building.district} onChange={handleDistrict} />
                    )}
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('building.ZIP')} name="zip">
                    {building && <Input type="text" size="large" defaultValue={building.zip} onChange={handleZip} />}
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('building.ADDRESS')} name="address">
                    {building && (
                      <Input type="text" size="large" defaultValue={building.address} onChange={handleAddress} />
                    )}
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label={t('building.BUILDING_NUMBER')} name="buildingNumber">
                    {building && (
                      <Input
                        type="text"
                        size="large"
                        defaultValue={building.buildingNumber}
                        onChange={handleBuildingNumber}
                      />
                    )}
                  </Form.Item>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button type="primary" htmlType="submit">
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

export default BuildingDetail;
