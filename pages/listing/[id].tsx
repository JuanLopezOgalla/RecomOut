import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '~/components/Screens/Container';
import ApartmentSpec from '~/components/Screens/ApartmentSpec';
import AmenityItem from '~/components/Screens/AmenityItem';
import PhotoUpload from '~/components/Screens/PhotoUpload';
import { FileUpload } from '~/components/Screens/MainSlider';
import { UploadFileName } from './add';
import {
  UPDATE_LISTING_MUTATION,
  UPDATE_PROPERTY_MUTATION,
  GET_LISTING_QUERY,
  GET_PRESIGNED_POST,
} from '~/utils/graphql';
import CheckBox from '~/public/icons/checkbox.svg';
import Bed from '~/public/icons/bed.svg';
import Bath from '~/public/icons/bath.svg';
import Sqft from '~/public/icons/sqft.svg';
import { Form, Input, Button, Select } from 'antd';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import styles from './Listing.module.css';
import { cls } from '~/utils/functions';
import {
  minQuantity,
  propertyTypes,
  maxQuantity,
  defaultAmenities,
  listingTypes,
  amountTypes,
} from '~/utils/constants';
import { useQuery, useMutation } from '@apollo/client';
import { ROUTES } from '~/utils/routes';
import { Property } from './add';
import { firebase } from '~/utils/firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setFbToken } from '~/store/app/actions';
import { NextSeo } from 'next-seo';
import { AMENITY } from '~/components/Screens/AddListItem/stepAmentities';

export type Listing = {
  id: number;
  property: Property;
  listingType: string;
  amountType: string;
  amount: number;
  amountCurrency: string;
  imageNames: string[];
  description: string;
};

const ListingDetail = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  const { Option } = Select;
  const { TextArea } = Input;

  const initPhotos = [null, null, null, null, null, null];

  const [oldListing, setOldListing] = useState<Listing>();
  const [listing, setListing] = useState<Listing>();
  const [amenities, setAmenities] = useState<Array<AMENITY>>(defaultAmenities);
  const [photos, setPhotos] = useState<FileUpload[]>(initPhotos);
  const [uploadFileName, setUploadFileName] = useState<UploadFileName>(null);
  const [uploadFile, setUploadFile] = useState<File>(null);
  const [uploadResult, setUploadResult] = useState(true);
  const [fullPhotos, setFullPhotos] = useState(true);
  const [description, setDescription] = useState('');

  const getS3PresignedPOSTUrlQuery = useQuery(GET_PRESIGNED_POST, {
    variables: uploadFileName,
    skip: !uploadFileName,
  });

  const [updateListingLink] = useMutation(UPDATE_LISTING_MUTATION, {
    variables: listing,
    update: () => {
      router.push(`${ROUTES.LISTING}?lang=${query.lang}`);
    },
    onError: err => {
      if (err.message.includes('Firebase ID token has expired')) {
        getNewToken();
      }
    },
  });

  const [updatePropertyLink] = useMutation(UPDATE_PROPERTY_MUTATION, {
    variables: listing && listing.property,
    update: () => {
      updateListingLink();
    },
    onError: err => {
      if (err.message.includes('Firebase ID token has expired')) {
        getNewToken();
      }
    },
  });

  const oldListingQuery = useQuery(GET_LISTING_QUERY, {
    variables: oldListing,
    skip: !oldListing,
  });

  useEffect(() => {
    const uploadS3 = async (data: any) => {
      const formData = new FormData();

      formData.append('bucket', data.fields.bucket);
      formData.append('key', data.fields.key.replace('${filename}', uploadFile.name));
      formData.append('policy', data.fields.policy);
      formData.append('X-Amz-Algorithm', data.fields.algorithm);
      formData.append('X-Amz-Credential', data.fields.credential);
      formData.append('X-Amz-Date', data.fields.date);
      formData.append('X-Amz-Signature', data.fields.signature);
      formData.append('file', uploadFile as unknown as Blob);

      try {
        const response = await axios({
          method: 'post',
          url: data.url,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 204) {
          setUploadResult(uploadResult && true);

          setPhotos(
            photos.map(photo => {
              if (photo) return { id: photo.id, file: photo.file, loading: false };
              else photo;
            })
          );
        }
      } catch (error) {
        console.log(error, 'Image upload failed!');
        setUploadResult(false);
      }
    };

    if (getS3PresignedPOSTUrlQuery.data) {
      uploadS3(getS3PresignedPOSTUrlQuery.data.getS3PresignedPost);
    }
  }, [getS3PresignedPOSTUrlQuery.data]);

  useEffect(() => {
    if (oldListingQuery.data) {
      let oldListingQueryData = oldListingQuery.data.getListing;

      setListing({ ...oldListingQueryData, imageNames: [...oldListingQueryData.imageNames, ''] });

      let amenities: AMENITY[] = defaultAmenities;

      for (let i = 0; i < oldListingQuery.data.getListing.property.amenities.length; i++) {
        amenities.map(amenity => {
          if (amenity.title === oldListingQuery.data.getListing.property.amenities[i]) amenity.active = true;
        });
      }

      setAmenities(amenities);
    }
  }, [oldListingQuery.data]);

  useEffect(() => {
    if (router.query.id) {
      const oldListing = {
        id: parseInt(router.query.id.toString()),
        property: null,
        listingType: '',
        amount: 0,
        amountType: '',
        amountCurrency: '',
        imageNames: [],
        description: '',
      };

      setOldListing(oldListing);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (listing) {
      let checkFull = true;

      photos.map((photo, index) => {
        if ((!photo || (photo && !photo.file)) && listing.imageNames[index] === '') checkFull = false;
      });

      if (checkFull) {
        setPhotos(oldPhotos => [...oldPhotos, null]);
        setListing({ ...listing, imageNames: [...listing.imageNames, ''] });
        setFullPhotos(true);
      }
    }
  }, [photos]);

  useEffect(() => {
    if (oldListingQuery.error && oldListingQuery.error.message.includes('Firebase ID token has expired')) {
      getNewToken();
    }
  }, [oldListingQuery.error, getS3PresignedPOSTUrlQuery.error]);

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

  const handleAmount = (e: { target: { value: string } }) => {
    setListing({ ...listing, amount: parseInt(e.target.value) });
  };

  const handleListingType = (value: string) => {
    setListing({ ...listing, listingType: value });
  };

  const handleAmountType = (value: string) => {
    setListing({ ...listing, amountType: value });
  };

  const handlePropertyType = (value: string) => {
    setListing({ ...listing, property: { ...listing.property, propertyType: value } });
  };

  const handleBedRooms = (value: number) => {
    setListing({ ...listing, property: { ...listing.property, beds: value } });
  };

  const handleBathRooms = (value: number) => {
    setListing({ ...listing, property: { ...listing.property, baths: value } });
  };

  const handleSqft = (value: number) => {
    setListing({ ...listing, property: { ...listing.property, sqft: value } });
  };

  const handleUnitNumber = (e: { target: { value: string } }) => {
    setListing({ ...listing, property: { ...listing.property, unitNumber: e.target.value } });
  };

  const handleCheck = (title: string) => {
    setAmenities(prevState =>
      prevState.map(el => {
        if (el.title === title) {
          el.active = !el.active;
        }

        return el;
      })
    );

    let newAmenities = [];

    setTimeout(() => {
      amenities.map(amenity => {
        if (amenity.active) newAmenities.push(amenity.title);
      });

      setListing({ ...listing, property: { ...listing.property, amenities: newAmenities } });
    }, 500);
  };

  const handlePhoto = (index: number, file: File) => {
    let photoNumber = 0;

    setPhotos(
      photos.map((photo, i) => {
        if (photo) photoNumber++;

        if (i !== index) return photo;
        else {
          let newImageNames = listing.imageNames.map((imageName, i) => {
            if (index === i) return '';
            else return imageName;
          });

          setListing({ ...listing, imageNames: newImageNames });

          return { id: index, file: file, loading: file ? true : false };
        }
      })
    );

    if (file) uploadImage(file);

    if (photoNumber > 4 || (photoNumber === 4 && file)) setFullPhotos(true);
  };

  const uploadImage = (image: File) => {
    setUploadFileName({ name: image.name });
    setUploadFile(image);
  };

  const onFinish = (values: Listing) => {
    if (listing.listingType === listingTypes[0]) setListing({ ...listing, amountType: amountTypes[4] });

    let photoNumber = 0;
    let imageNumber = 0;

    photos.map(photo => {
      if (photo && photo.file) photoNumber++;
    });

    setListing({
      ...listing,
      imageNames: listing.imageNames.map((imageName, index) => {
        if (imageName) imageNumber++;

        if (imageName) {
          const uploadedUrl = imageName.split('/');
          const params = uploadedUrl[6].split('?');

          return params[0];
        } else {
          if (photos[index] && photos[index].file) return photos[index].file.name;
          else return '';
        }
      }),
      description: values.description,
    });
    if (photoNumber + imageNumber > 4) {
      setFullPhotos(true);

      try {
        updatePropertyLink();
      } catch (e) {
        console.log(e, 'error');

        getNewToken();
      }
    } else setFullPhotos(false);
  };

  return (
    <Container className="propertyContainer listingContainer bg-listBackground pb-12">
      <NextSeo title="RECOM Edit Listing" description="RECOM Edit Listing." />
      <div className="w-full lg:flex">
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center pt-28">
          <div className={cls(['w-full lg:w-sellProperty overflow-y-auto h-full', styles.photoWrap])}>
            {!fullPhotos && <div className="text-14 font-bold text-danger mb-2">{t('post.ADD_AT_LEAST')}</div>}
            <PhotoUpload
              index={0}
              photo={photos[0] && photos[0].file}
              isLoading={photos[0] && photos[0].loading}
              handlePhoto={handlePhoto}
              isFirstPhoto={true}
              imageName={listing && listing.imageNames[0]}
            />
            <div className="flex flex-wrap mt-2">
              {listing &&
                listing.imageNames.map((imageName, index) => {
                  if (index)
                    return (
                      <PhotoUpload
                        index={index}
                        photo={photos[index] && photos[index].file}
                        isLoading={photos[index] && photos[index].loading}
                        handlePhoto={handlePhoto}
                        imageName={imageName}
                      />
                    );
                })}
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center pt-4 lg:pt-20">
          <div className="w-full lg:w-sellProperty">
            <div className="mt-8 flex justify-between">
              <h1 className="text-32 text-item font-bold">{t('listing.EDIT_LISTING_PROPERTY')}</h1>
            </div>
            <div className="mt-4">
              {listing && (
                <Form
                  name="properties"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  onFinish={onFinish}
                  autoComplete="off"
                  initialValues={{ description: listing.description }}
                >
                  <div className="mt-4">
                    <Form.Item label="" name="propertyType">
                      <Select showSearch onChange={handlePropertyType} defaultValue={listing.property.propertyType}>
                        {propertyTypes.map((type, key) => (
                          <Option value={type} key={key}>
                            {type}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="mt-4">
                    <Form.Item label="" name="unitNumber">
                      <Input
                        type="text"
                        size="large"
                        defaultValue={listing.property.unitNumber}
                        onChange={handleUnitNumber}
                      />
                    </Form.Item>
                  </div>
                  <div className="mt-8">
                    <ApartmentSpec
                      icon={<Bed className="text-listIcon w-8 h-8" />}
                      title={t('list.BEDROOMS')}
                      min={minQuantity}
                      max={maxQuantity}
                      value={listing.property.beds}
                      setValue={handleBedRooms}
                      type="post"
                    />
                    <ApartmentSpec
                      icon={<Bath className="text-listIcon w-8 h-8" />}
                      title={t('item.BATHROOMS')}
                      min={minQuantity}
                      max={maxQuantity}
                      value={listing.property.baths}
                      setValue={handleBathRooms}
                      type="post"
                    />
                    <ApartmentSpec
                      icon={<Sqft className="text-listIcon w-8 h-8" />}
                      title={t('post.SQFT')}
                      min={minQuantity}
                      max={maxQuantity}
                      value={listing.property.sqft}
                      setValue={handleSqft}
                      type="post"
                    />
                  </div>
                  {amenities.length && (
                    <div className="mt-4">
                      <div className="mt-6 flex flex-wrap">
                        {amenities.map((amenity, key) => (
                          <div
                            className="mr-4 w-20 h-36 px-2 py-4 bg-white rounded-2xl cursor-pointer mb-4 relative"
                            key={key}
                            onClick={() => {
                              handleCheck(amenity.title);
                            }}
                          >
                            <div className="flex justify-center">
                              <AmenityItem amenity={amenity.title} />
                            </div>
                            <div className="mt-4 text-10 text-black font-bold text-center">{amenity.title}</div>
                            <div className="flex justify-center absolute w-full bottom-4 -ml-2">
                              <CheckBox className={cls(['w-5 h-5', amenity.active ? 'text-auth' : 'text-uncheck'])} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <Form.Item label="" name="listingType">
                      <Select
                        showSearch
                        placeholder={t('listing.SELECT_LISTINGTYPE')}
                        onChange={handleListingType}
                        defaultValue={listing.listingType}
                      >
                        {listingTypes.map((type, key) => (
                          <Option value={type} key={key}>
                            {type}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="mt-4">
                    {listing.listingType === listingTypes[0] ? (
                      <div className="text-16 text-black font-medium mt-2 mr-3 capitalize">
                        {t('listing.AMOUNT_TYPE')}: <span className="font-bold">{amountTypes[4]}</span>
                      </div>
                    ) : (
                      <Form.Item label="" name="amountType">
                        <Select
                          showSearch
                          placeholder={t('listing.SELECT_AMOUNTTYPE')}
                          onChange={handleAmountType}
                          defaultValue={listing.amountType}
                        >
                          {amountTypes.map((type, index) => {
                            if (index < 4) return <Option value={type}>{type}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                    )}
                  </div>
                  <div className="mt-4 flex">
                    <div className="text-16 text-black font-medium mt-2 mr-3 capitalize">{t('listing.AMOUNT')}: </div>
                    <div className="w-20">
                      <Form.Item label="" name="amount">
                        <Input
                          type="number"
                          min={minQuantity}
                          value={listing.amount}
                          defaultValue={listing.amount}
                          onChange={handleAmount}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Form.Item label="" name="description">
                      <TextArea
                        value={description}
                        onChange={e => {
                          setDescription(e.target.value);
                        }}
                        placeholder={t('post.DESCRIPTION')}
                        autoSize={{ minRows: 8, maxRows: 12 }}
                        showCount
                        minLength={100}
                        maxLength={500}
                      />
                    </Form.Item>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button type="primary" htmlType="submit">
                      {t('listing.SAVE')}
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingDetail;
