import React from 'react';
import { Button, Form, InputNumber } from 'antd';
import { useTranslation } from 'next-export-i18n';
import { ListingPrice } from '~/pages/listing/add';
import { cls } from '~/utils/functions';

const StepFinancials = ({
  isActive,
  listingPrice,
  handleListingPrice,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  listingPrice: ListingPrice;
  handleListingPrice: ({ isRent, price }: { isRent?: boolean; price?: number }) => void;
  handleBack: () => void;
  handleNext: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cls([
        'flex-col h-photoGallery overflow-y-auto w-full flex justify-center items-center mt-20 pl-20 pr-20',
        isActive ? 'block' : 'hidden',
      ])}
    >
      <div className="flex justify-between w-full mb-4">
        <div
          className={cls([
            'text-14 py-4 px-10 font-medium rounded-full capitalize cursor-pointer',
            listingPrice.isRent ? 'bg-auth text-white' : 'bg-white text-black',
          ])}
          onClick={() => {
            handleListingPrice({ isRent: true });
          }}
        >
          {t('home.RENT')}
        </div>
        <div
          className={cls([
            'text-14 py-4 px-10 font-medium rounded-full capitalize cursor-pointer',
            !listingPrice.isRent ? 'bg-auth text-white' : 'bg-white text-black',
          ])}
          onClick={() => {
            handleListingPrice({ isRent: false });
          }}
        >
          {t('home.BUY')}
        </div>
      </div>
      <div className="financials_form flex px-4 py-3 w-48 border border-solid border-black border-opacity-10 rounded-xl">
        <Form.Item label="" name="budget">
          <InputNumber
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            // @ts-ignore
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            onChange={value => handleListingPrice({ price: value })}
          />
        </Form.Item>
        <div className="text-16 font-semibold text-currencyLable pt-0.5">AED/M</div>
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

export default StepFinancials;
