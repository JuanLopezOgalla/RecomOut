import React from 'react';
import { cls } from '~/utils/functions';
import CheckBox from '~/public/icons/checkbox.svg';
import { Button } from 'antd';
import { useTranslation } from 'next-export-i18n';

export type AMENITY = {
  title: string;
  active: boolean;
};

const StepAmentities = ({
  isActive,
  amenities,
  handleAmenities,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  amenities: Array<AMENITY>;
  handleAmenities: (values: string) => void;
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
      <div className="w-full overflow-y-auto lg:w-sellProperty">
        <div className="mt-6 flex flex-wrap">
          {amenities.map((amenity, key) => (
            <div
              className="mr-4 w-20 h-36 px-2 py-4 bg-white rounded-2xl cursor-pointer mb-4 relative"
              key={key}
              onClick={() => {
                handleAmenities(amenity.title);
              }}
            >
              <div className="mt-4 text-10 text-black font-bold text-center">{amenity.title}</div>
              <div className="flex justify-center absolute w-full bottom-4 -ml-2">
                <CheckBox className={cls(['w-5 h-5', amenity.active ? 'text-auth' : 'text-uncheck'])} />
              </div>
            </div>
          ))}
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

export default StepAmentities;
