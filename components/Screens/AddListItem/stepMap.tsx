import { Button } from 'antd';
import { cls } from '~/utils/functions';
import { useTranslation } from 'next-export-i18n';
import React from 'react';
import CustomMap, { GEOLOCATION } from '../CustomMap';

const StepMap = ({
  isActive,
  country,
  city,
  location,
  handleLocation,
  handleNext,
  handleBack,
}: {
  isActive: boolean;
  country: string;
  city: string;
  location: GEOLOCATION;
  handleLocation: (location: GEOLOCATION) => void;
  handleNext: () => void;
  handleBack: () => void;
}) => {
  const { t } = useTranslation();

  const handleMap = (newLoc: GEOLOCATION) => {
    handleLocation(newLoc);
  };

  return (
    <div
      className={cls([
        'overflow-y-auto w-full flex flex-col justify-center items-center px-4 lg:px-0 lg:w-sellProperty',
        isActive ? 'block' : 'hidden',
      ])}
    >
      {location && (
        <CustomMap city={city} country={country} location={location} handleLocation={handleMap} autoSearch={true} />
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

export default StepMap;
