import { Button } from 'antd';
import { useTranslation } from 'next-export-i18n';
import React from 'react';
import { cls } from '~/utils/functions';

export const defaultListingAttributes = ['Peaceful', 'Unique', 'Family-friendly', 'Stylish', 'Central', 'Spacious'];

const StepTitle = ({
  isActive,
  bedRooms,
  propertyType,
  financials,
  city,
  listingAttributes,
  handleAttributes,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  bedRooms: number;
  propertyType: string;
  financials: string;
  city: string;
  listingAttributes: string[];
  handleAttributes: (value: string) => void;
  handleBack: () => void;
  handleNext: () => void;
}) => {
  const { t } = useTranslation();

  const getTitle = () => {
    let selectedTitle = '';

    listingAttributes.map((title, index) => {
      if (title) {
        if (index) selectedTitle += ` and ${title.toLowerCase()}`;
        else selectedTitle += title;
      }
    });

    return `${selectedTitle} ${bedRooms}-bedroom ${propertyType} to ${financials} in ${city}`;
  };

  return (
    <div
      className={cls([
        'flex flex-col justify-center items-center w-full h-photoGallery overflow-y-auto mt-20',
        isActive ? 'block' : 'hidden',
      ])}
    >
      <div className="md:hidden text-24 md:text-32 text-black md:text-white font-bold w-full mb-4 md:pl-12">
        {t('post.CHOOSE_UP_TO')}
      </div>
      <div className="flex flex-wrap">
        {defaultListingAttributes.map(el => (
          <div
            className={cls([
              'px-4 py-3 rounded-full text-14 mr-2 mb-2 cursor-pointer',
              listingAttributes.includes(el) ? 'text-white bg-black font-bold' : 'text-black bg-white font-medium',
            ])}
            onClick={() => handleAttributes(el)}
          >
            {el}
          </div>
        ))}
      </div>
      {listingAttributes.length ? (
        <div className="mt-2 text-14 text-black break-normal pl-20 pr-20">
          <span className="font-bold">{t('post.TITLE')}:</span> {getTitle()}
        </div>
      ) : (
        <></>
      )}
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

export default StepTitle;
