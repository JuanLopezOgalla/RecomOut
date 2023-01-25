import { useTranslation } from 'next-export-i18n';
import React from 'react';
import { cls } from '~/utils/functions';
import ApartmentSpec from '../ApartmentSpec';
import Bed from '~/public/icons/bed.svg';
import Bath from '~/public/icons/bath.svg';
import Sqft from '~/public/icons/sqft.svg';
import { maxQuantity, minQuantity } from '~/utils/constants';
import { Button } from 'antd';

const StepSpecs = ({
  isActive,
  bedRooms,
  bathRooms,
  sqft,
  handleBedRooms,
  handleBathRooms,
  handleSQFT,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  bedRooms: number;
  bathRooms: number;
  sqft: number;
  handleBedRooms: (value: number) => void;
  handleBathRooms: (value: number) => void;
  handleSQFT: (value: number) => void;
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
      <div className="w-full lg:w-sellProperty">
        <div className="md:hidden text-24 md:text-32 text-black md:text-white font-bold w-full mb-4 md:pl-12">
          {t('post.SPECS')}
        </div>
        <ApartmentSpec
          icon={<Bed className="text-listIcon w-8 h-8" />}
          title={t('list.BEDROOMS')}
          min={minQuantity}
          max={maxQuantity}
          value={bedRooms}
          setValue={handleBedRooms}
          type="post"
        />
        <ApartmentSpec
          icon={<Bath className="text-listIcon w-8 h-8" />}
          title={t('item.BATHROOMS')}
          min={minQuantity}
          max={maxQuantity}
          value={bathRooms}
          setValue={handleBathRooms}
          type="post"
        />
        <ApartmentSpec
          icon={<Sqft className="text-listIcon w-8 h-8" />}
          title={t('post.SQFT')}
          min={minQuantity}
          max={maxQuantity}
          value={sqft}
          setValue={handleSQFT}
          type="post"
        />
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

export default StepSpecs;
