import { Button, FormInstance } from 'antd';
import { useTranslation } from 'next-export-i18n';
import React from 'react';
import { ListingPrice } from '~/pages/listing/add';
import { cls } from '~/utils/functions';
import MainSlider, { FileUpload } from '../MainSlider';
import { AMENITY } from './stepAmentities';

const StepReview = ({
  isActive,
  form,
  photos,
  title,
  propertyType,
  bedRooms,
  bathRooms,
  sqft,
  amenities,
  listingPrice,
  handleEditStep,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  form: FormInstance;
  photos: FileUpload[];
  title: string;
  propertyType: string;
  bedRooms: number;
  bathRooms: number;
  sqft: number;
  amenities: AMENITY[];
  listingPrice: ListingPrice;
  handleEditStep: (step: number) => void;
  handleBack: () => void;
  handleNext: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cls([
        'flex flex-col justify-center items-center w-full h-photoGallery overflow-y-auto mt-20',
        isActive ? 'block' : 'hidden',
      ])}
    >
      <div className="w-full lg:w-sellProperty h-full">
        <div className="w-full">
          <div className="h-preview overflow-hidden rounded-lg">
            <MainSlider mainSliders={photos} type="file" navigation={false} />
          </div>
          <div
            className="mt-2 text-12 text-auth font-medium underline cursor-pointer text-right pr-4"
            onClick={() => {
              handleEditStep(3);
            }}
          >
            {t('profile.EDIT')}
          </div>
          <div className="mt-4 text-20 text-black pb-4 font-bold pr-4 border-b border-solid border-black border-opacity-10">
            {title}
            <span
              className="text-12 text-auth font-medium underline cursor-pointer float-right"
              onClick={() => {
                handleEditStep(8);
              }}
            >
              {t('profile.EDIT')}
            </span>
          </div>
          <div className="mt-6 pb-4 border-b border-solid border-black border-opacity-10 flex justify-between pr-4">
            <div className="text-14 text-black font-bold">Private room in loft hosted by Marcel</div>
          </div>
          <div className="mt-6 pb-4 border-b border-solid border-black border-opacity-10 pr-4">
            <div className="text-14 text-black font-medium">
              {`${form.getFieldValue('city')}, ${form.getFieldValue('state')}, ${form.getFieldValue('country')}`}
              <span
                className="text-12 text-auth font-medium underline cursor-pointer float-right"
                onClick={() => {
                  handleEditStep(1);
                }}
              >
                {t('profile.EDIT')}
              </span>
            </div>
          </div>
          <div className="mt-6 pb-4 border-b border-solid border-black border-opacity-10 pr-4">
            <div className="text-14 text-black font-medium">
              {t('post.PROPERTYTYPE')}: {propertyType}
              <span
                className="text-12 text-auth font-medium underline cursor-pointer float-right"
                onClick={() => {
                  handleEditStep(3);
                }}
              >
                {t('profile.EDIT')}
              </span>
            </div>
          </div>
          <div className="mt-6 pb-4 border-b border-solid border-black border-opacity-10 pr-4">
            <div className="text-14 text-black font-medium">
              {t('list.BEDROOMS')}: {bedRooms}, {t('item.BATHROOMS')}: {bathRooms}, {t('post.SQFT')}: {sqft}
              <span
                className="text-12 text-auth font-medium underline cursor-pointer float-right"
                onClick={() => {
                  handleEditStep(5);
                }}
              >
                {t('profile.EDIT')}
              </span>
            </div>
          </div>
          <div className="mt-6 pb-4 border-b border-solid border-black border-opacity-10 pr-4">
            <div className="text-14 text-black font-medium">
              <span>{t('item.AMENITIES')}: </span>
              {amenities.map(amenity => amenity.active && <span>{amenity.title}, </span>)}{' '}
              <span
                className="text-12 text-auth font-medium underline cursor-pointer float-right"
                onClick={() => {
                  handleEditStep(6);
                }}
              >
                {t('profile.EDIT')}
              </span>
            </div>
          </div>
          <div className="mt-6 pb-4 border-b border-solid border-black border-opacity-10 pr-4">
            <div className="text-14 text-black font-medium">
              {listingPrice.isRent ? 'Rent' : 'Buy'}, {listingPrice.price} AED
              <span
                className="text-12 text-auth font-medium underline cursor-pointer float-right"
                onClick={() => {
                  handleEditStep(7);
                }}
              >
                {t('profile.EDIT')}
              </span>
            </div>
          </div>
          <div className="mt-6 pb-4 border-b border-solid border-black border-opacity-10 pr-4">
            <div className="text-14 text-black font-medium overflow-x-hidden">
              {form.getFieldValue('description')}
              <span
                className="text-12 text-auth font-medium underline cursor-pointer float-right"
                onClick={() => {
                  handleEditStep(9);
                }}
              >
                {t('profile.EDIT')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="handleWrap absolute bottom-0 w-full border-t border-solid border-black border-opacity-10">
        <div className="px-4 md:px-12 py-6 flex justify-between">
          <Button type="default" onClick={handleBack}>
            {t('post.BACK')}
          </Button>

          <Button type="primary" onClick={handleNext}>
            {t('post.NEXT')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
