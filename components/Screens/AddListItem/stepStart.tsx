import React from 'react';
import { cls } from '~/utils/functions';
import { useTranslation } from 'next-export-i18n';
import { Button } from 'antd';

const StepStart = ({ isActive, handleNext }: { isActive: boolean; handleNext: () => void }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cls([
        'flex flex-col justify-center items-center w-full lg:w-sellProperty',
        isActive ? 'block' : 'hidden',
      ])}
    >
      <div className="text-24 font-bold text-black text-center">{t('post.LIST_YOUR_PROPERTY')}</div>
      <div className="handleWrap flex justify-center pt-10">
        <Button type="primary" onClick={handleNext}>
          {t('post.LIST_FOR_FREE')}
        </Button>
      </div>
    </div>
  );
};

export default StepStart;
