import { Button } from 'antd';
import { useTranslation } from 'next-export-i18n';
import React from 'react';
import { cls } from '~/utils/functions';

const StepPublish = ({ isActive }: { isActive: boolean }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cls([
        'flex flex-col justify-center items-center w-full h-photoGallery overflow-y-auto mt-20',
        isActive ? 'block' : 'hidden',
      ])}
    >
      <Button type="primary" htmlType="submit">
        {t('post.PUBLISH')}
      </Button>
    </div>
  );
};

export default StepPublish;
