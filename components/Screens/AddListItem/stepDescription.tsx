import { Button, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useTranslation } from 'next-export-i18n';
import React from 'react';
import { cls } from '~/utils/functions';

const StepDescription = ({
  isActive,
  title,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  title: string;
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
        <div className="mb-4 text-20 text-black">{title}</div>
        <Form.Item label="" name="description">
          <TextArea
            placeholder={t('post.DESCRIPTION')}
            autoSize={{ minRows: 8, maxRows: 12 }}
            showCount
            minLength={100}
            maxLength={100}
          />
        </Form.Item>
      </div>
      <div className="handleWrap absolute bottom-0 w-full border-t border-solid border-black border-opacity-10">
        <div className="px-4 md:px-12 py-6 flex justify-between">
          <Button type="default" onClick={handleBack}>
            {t('post.BACK')}
          </Button>
          <Button type="primary" onClick={handleNext}>
            {t('post.REVIEW')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepDescription;
