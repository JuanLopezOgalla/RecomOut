import React, { useState } from 'react';
import Container from '~/components/Screens/Container';
import { useTranslation } from 'next-export-i18n';
import { cls } from '~/utils/functions';
import { NextSeo } from 'next-seo';

const Subscription = () => {
  const { t } = useTranslation();

  const plans = [
    {
      id: 'price_1KRAeVGZmbfZGfjGtOUuVLjY',
      label: 'Base',
      price: 0,
    },
    {
      id: 'price_1KRAeVGZmbfZGfjGWqnMKGeB',
      label: 'Business',
      price: 29,
    },
    {
      id: 'price_1KRAeVGZmbfZGfjGNEL3upfo',
      label: 'Premium',
      price: 49,
    },
  ];

  const [plan, setPlan] = useState(plans[0].id);

  const handlePlan = (plan: string) => {
    setPlan(plan);
  };

  return (
    <Container className="propertyContainer checkoutContainer pt-24 bg-listBackground flex justify-center pb-20 border-b border-solid border-black border-opacity-10">
      <NextSeo title="RECOM Payment Checkout" description="RECOM payment checkout." />
      <div className="w-full sm:w-newProperty px-4 sm:px-0">
        <div className="mt-8">
          <h1 className="text-40 text-item font-bold">{t('header.SUBSCRIPTION')}</h1>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {plans.map(el => (
            <div
              className={cls([
                'bg-white text-center py-6 rounded-2xl cursor-pointer',
                el.id === plan ? 'border-auth border' : '',
              ])}
              onClick={() => handlePlan(el.id)}
            >
              <h2 className="text-22 text-black font-bold">{el.label}</h2>
              <p className="text-18 text-black font-medium mb-0">
                <span className="font-bold">{el.price}</span> USD
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Subscription;
