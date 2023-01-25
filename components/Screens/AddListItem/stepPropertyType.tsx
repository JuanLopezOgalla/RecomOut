import { Button } from 'antd';
import { useTranslation } from 'next-export-i18n';
import React from 'react';
import { propertyTypes } from '~/utils/constants';
import { cls } from '~/utils/functions';

const StepPropertyType = ({
  isActive,
  propertyType,
  handlePropertyType,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  propertyType: string;
  handlePropertyType: (property: string) => void;
  handleBack: () => void;
  handleNext: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cls([
        'flex flex-col justify-center items-center w-full lg:w-sellProperty',
        isActive ? 'block' : 'hidden',
      ])}
    >
      {propertyTypes.map(item => (
        <div
          className={cls([
            'w-full justify-center text-14 px-6 py-3 border border-black text-bold border-solid border-opacity-10 rounded-lg mb-2 cursor-pointer',
            item === propertyType ? 'text-white bg-black' : 'text-black',
          ])}
          onClick={() => {
            handlePropertyType(item);
          }}
        >
          {item}
        </div>
      ))}

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

export default StepPropertyType;
