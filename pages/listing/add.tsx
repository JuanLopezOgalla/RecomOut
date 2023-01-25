import React, { FC, useEffect, useState } from 'react';
import Container from '~/components/Screens/Container';
import { Form } from 'antd';
import Geocode from 'react-geocode';
import { useTranslation } from 'next-export-i18n';
import { useDispatch } from 'react-redux';
import { setVisibleMobileFooter } from '~/store/app/actions';
import styles from './Listing.module.css';
import { cls } from '~/utils/functions';
import { defaultCities, defaultStates, defaultCountry, defaultAmenities } from '~/utils/constants';
import { NextSeo } from 'next-seo';
import StepStart from '~/components/Screens/AddListItem/stepStart';
import StepLocation from '~/components/Screens/AddListItem/stepLocation';
import StepMap from '~/components/Screens/AddListItem/stepMap';
import StepPropertyType from '~/components/Screens/AddListItem/stepPropertyType';
import StepPhoto from '~/components/Screens/AddListItem/stepPhoto';
import StepSpecs from '~/components/Screens/AddListItem/stepSpecs';
import StepAmentities, { AMENITY } from '~/components/Screens/AddListItem/stepAmentities';
import StepFinancials from '~/components/Screens/AddListItem/stepFinancials';
import StepTitle from '~/components/Screens/AddListItem/stepTitle';
import StepDescription from '~/components/Screens/AddListItem/stepDescription';
import StepReview from '~/components/Screens/AddListItem/stepReview';
import StepPublish from '~/components/Screens/AddListItem/stepPublish';
import { GEOLOCATION } from '~/components/Screens/CustomMap';
import { FileUpload } from '~/components/Screens/MainSlider';
import { useMutation } from '@apollo/client';
import { CREATE_LISTING_MUTATION, CREATE_PROPERTY_MUTATION } from '~/utils/graphql';
import StepEnd from '~/components/Screens/AddListItem/stepEnd';

export type Post = {
  country: string;
  city: string;
  state: string;
  price: number;
  description: string;
};

export type Community = {
  id: number;
  name: string;
};

export interface COUNTRIES {
  name: string;
  isoCode: string;
}

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
  locationLat: number;
  locationLng: number;
  communityId: number;
  isActive: boolean;
};

export type Property = {
  id: number;
  buildingId: number;
  communityId: number;
  unitNumber: string;
  propertyType: string;
  beds: number;
  baths: number;
  sqft: number;
  amenities: string[];
  views: string[];
  attributes: string[];
};

export type Listing = {
  id: number;
  propertyId: number;
  listingType: string;
  amount: number;
  amountCurrency: string;
  amountType: string;
  imageNames: string[];
  description: string;
};

export type UploadFileName = {
  name: string;
};

export type ListingPrice = {
  isRent: boolean;
  price: number;
};

const AddListing: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [propertyType, setPropertyType] = useState('');
  const [bedRooms, setBedRooms] = useState(0);
  const [bathRooms, setBathRooms] = useState(0);
  const [sqft, setSQFT] = useState(0);
  const [amenities, setAmenities] = useState<Array<AMENITY>>([]);
  const [listingPrice, setListingPrice] = useState<ListingPrice>({ isRent: false, price: 0 });
  const [listingAttributes, setListingAttributes] = useState<string[]>([]);
  const [photos, setPhotos] = useState<FileUpload[]>([
    { id: 0, loading: false },
    { id: 1, loading: false },
    { id: 2, loading: false },
    { id: 3, loading: false },
    { id: 4, loading: false },
  ]);

  useEffect(() => {
    setAmenities(defaultAmenities);
  }, [defaultAmenities]);

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [location, setLocation] = useState<GEOLOCATION>();
  const [activeStep, setActiveStep] = useState(0);
  const LISTING_STEP_LABELS = [
    { value: 'start', label: '' },
    { value: 'location', label: t('home.LOCATION') },
    { value: 'map', label: t('post.LOCATION_CORRECT') },
    { value: 'property', label: t('post.SELECT_PROPERTY_TYPE') },
    { value: 'photo', label: t('post.ADD_SOME_PHOTOS') },
    { value: 'specs', label: t('post.SPECS') },
    { value: 'amentities', label: t('item.AMENITIES') },
    { value: 'financials', label: t('post.FINANCIALS') },
    { value: 'title', label: t('post.TITLE') },
    { value: 'description', label: t('post.DESCRIPTION') },
    { value: 'review', label: t('post.REVIEW') },
    { value: 'publish', label: t('post.PUBLISH') },
    { value: 'end', label: t('post.END') },
  ];
  const [form] = Form.useForm();

  Geocode.setApiKey(GOOGLE_MAPS_API_KEY);

  const [createProperty] = useMutation(CREATE_PROPERTY_MUTATION, {
    update: (_, mutationResult) => {
      createNewListing(mutationResult.data.createProperty.id);
    },
  });

  const [createListing] = useMutation(CREATE_LISTING_MUTATION, {
    update: () => {
      setActiveStep(12);
    },
  });

  const initListing = () => {
    setPropertyType('');
    setBedRooms(0);
    setBathRooms(0);
    setSQFT(0);
    setAmenities(defaultAmenities);
    setListingAttributes([]);
    setListingPrice({ isRent: false, price: 0 });
    form.setFieldsValue({ description: '', city: '', country: '', state: '' });
  };

  const createNewListing = property => {
    let photoNames = [];

    photos.map(photo => {
      if (photo.file) photoNames.push(photo.file.name);
    });

    let newListingData: Listing = {
      id: 0,
      propertyId: property,
      listingType: listingPrice.isRent ? 'rent' : 'buy',
      amount: listingPrice.price,
      amountCurrency: 'AED',
      amountType: 'onetime',
      imageNames: photoNames,
      description: form.getFieldValue('description'),
    };

    createListing({ variables: newListingData });
  };

  const createNewProperty = () => {
    let newAmenities = [];

    amenities.map(amenity => {
      if (amenity.active) newAmenities.push(amenity.title);
    });

    let newPropertyData: Property = {
      id: 0,
      buildingId: form.getFieldValue('building'),
      communityId: form.getFieldValue('community'),
      unitNumber: '01-01',
      propertyType: propertyType,
      beds: bedRooms,
      baths: bathRooms,
      sqft: sqft,
      amenities: newAmenities,
      views: [],
      attributes: listingAttributes,
    };

    createProperty({ variables: newPropertyData });
  };

  const onChangeLocation = (location: GEOLOCATION) => {
    setLocation(location);
  };

  const onChangeAmentites = (title: string) => {
    setAmenities(prevState =>
      prevState.map(el => {
        if (el.title === title) {
          el.active = !el.active;
        }

        return el;
      })
    );
  };

  const handleAttributes = (attribute: string) => {
    if (listingAttributes.some(el => el === attribute))
      setListingAttributes(
        listingAttributes.filter(el => {
          return el !== attribute;
        })
      );
    else {
      setListingAttributes(prevAttributes => [...prevAttributes, attribute]);
    }
  };

  const handleListingPrice = ({ isRent, price }: { isRent?: boolean; price?: number }) => {
    setListingPrice({
      isRent: isRent === undefined ? listingPrice.isRent : isRent,
      price: price === undefined ? listingPrice.price : price,
    });
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
    dispatch(setVisibleMobileFooter(false));
  };

  const handleBack = () => {
    setActiveStep(prev => (prev === 0 ? 0 : prev - 1));
    dispatch(setVisibleMobileFooter(false));
  };

  const handlePhotos = (files: FileUpload[]) => {
    setPhotos(files);
  };

  const handleEditStep = (value: number) => {
    setActiveStep(value);
  };

  const getTitle = () => {
    let selectedTitle = '';

    listingAttributes.map((title, index) => {
      if (title) {
        if (index) selectedTitle += ` and ${title.toLowerCase()}`;
        else selectedTitle += title;
      }
    });

    return `${selectedTitle} ${bedRooms}-bedroom ${propertyType} to ${
      listingPrice.isRent ? 'Rent' : 'Buy'
    } in ${form.getFieldValue('city')}`;
  };

  const onFinish = () => {
    createNewProperty();
  };

  return (
    <Container className="mainContainer propertyContainer bg-listBackground">
      <NextSeo title="RECOM Add Listing" description="RECOM Add Listing." />
      <div className="w-full lg:flex">
        <div
          className={cls([
            'flex justify-center items-center h-screen lg:w-1/2 hidden lg:flex text-32 text-white font-bold pl-12',
            styles.leftBackground,
          ])}
        >
          {LISTING_STEP_LABELS[activeStep].label}
        </div>
        <Form
          initialValues={{ country: defaultCountry, city: defaultCities[0], state: defaultStates[0] }}
          name="post"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          className="flex justify-center lg:w-1/2 px-4 h-screen relative"
        >
          <StepStart isActive={activeStep === 0} handleNext={handleNext} />
          <StepLocation
            isActive={activeStep === 1}
            form={form}
            handleNext={handleNext}
            handleBack={handleBack}
            handleLocation={onChangeLocation}
          />
          <StepMap
            isActive={activeStep === 2}
            city={form.getFieldValue('city')}
            country={form.getFieldValue('country')}
            location={location}
            handleLocation={onChangeLocation}
            handleNext={handleNext}
            handleBack={handleBack}
          />
          <StepPropertyType
            isActive={activeStep === 3}
            propertyType={propertyType}
            handlePropertyType={property => setPropertyType(property)}
            handleNext={handleNext}
            handleBack={handleBack}
          />
          <StepPhoto
            photos={photos}
            handlePhotos={handlePhotos}
            isActive={activeStep === 4}
            handleNext={handleNext}
            handleBack={handleBack}
          />
          <StepSpecs
            isActive={activeStep === 5}
            bedRooms={bedRooms}
            bathRooms={bathRooms}
            sqft={sqft}
            handleBathRooms={setBathRooms}
            handleBedRooms={setBedRooms}
            handleSQFT={setSQFT}
            handleNext={handleNext}
            handleBack={handleBack}
          />
          <StepAmentities
            isActive={activeStep === 6}
            amenities={amenities}
            handleAmenities={onChangeAmentites}
            handleNext={handleNext}
            handleBack={handleBack}
          />
          <StepFinancials
            isActive={activeStep === 7}
            listingPrice={listingPrice}
            handleListingPrice={handleListingPrice}
            handleNext={handleNext}
            handleBack={handleBack}
          />
          <StepTitle
            isActive={activeStep === 8}
            bedRooms={bedRooms}
            propertyType={propertyType}
            city={form.getFieldValue('city')}
            financials={`${listingPrice.isRent ? 'Rent' : 'Buy'} ${listingPrice.price}`}
            listingAttributes={listingAttributes}
            handleAttributes={handleAttributes}
            handleNext={handleNext}
            handleBack={handleBack}
          />
          <StepDescription isActive={activeStep === 9} title={''} handleNext={handleNext} handleBack={handleBack} />
          <StepReview
            isActive={activeStep === 10}
            form={form}
            photos={photos}
            title={getTitle()}
            propertyType={propertyType}
            bedRooms={bedRooms}
            bathRooms={bathRooms}
            sqft={sqft}
            amenities={amenities}
            listingPrice={listingPrice}
            handleEditStep={handleEditStep}
            handleNext={handleNext}
            handleBack={handleBack}
          />
          <StepPublish isActive={activeStep === 11} />
          <StepEnd isActive={activeStep === 12} initListing={initListing} />
        </Form>
      </div>
    </Container>
  );
};

export default AddListing;
