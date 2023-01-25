import React from 'react';
import Container from '~/components/Screens/Container';
import { useTranslation } from 'next-export-i18n';
import { NextSeo } from 'next-seo';

const Checkout = () => {
  const { t } = useTranslation();

  return (
    <Container className="propertyContainer checkoutContainer pt-24 bg-listBackground flex justify-center pb-20 border-b border-solid border-black border-opacity-10">
      <NextSeo title="RECOM Payment Checkout" description="RECOM payment checkout." />
      <div className="w-full sm:w-newProperty px-4 sm:px-0">
        <div className="mt-8">
          <h1 className="text-40 text-item font-bold">{t('header.CHECKOUT')}</h1>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          <h2 className="text-22 text-black font-bold">{t('checkout.TOTAL_PRICE')}</h2>
          <p className="text-18 text-black font-medium mb-0">
            <span className="font-bold">{'555'}</span> USD
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Checkout;
