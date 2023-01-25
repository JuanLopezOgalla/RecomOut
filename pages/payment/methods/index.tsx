import React, { FC } from 'react';
import { cls } from '~/utils/functions';
import Container from '~/components/Screens/Container';
import QuickNav from '~/components/QuickNav';
import { useSelector } from 'react-redux';
import { State } from '~/store/state';
import { useTranslation } from 'next-export-i18n';
import styles from './PaymentMethods.module.css';
import { NextSeo } from 'next-seo';

export type RentPaymentType = 'MONTHLY' | 'QUARTELY' | 'HALF_YEAR' | 'YEARLY' | 'Period';

const PaymentMethods: FC = () => {
  const { t } = useTranslation();
  const searchData = useSelector<State, State>(state => state);
  const hit = searchData.app.hit;

  return (
    <Container className="itemContainer pt-24 px-10 bg-listBackground flex flex-col items-center justify-center">
      <NextSeo title="RECOM Payment Detail" description="RECOM Payment Detail." />
      <div className="w-full sm:w-newProperty mt-7">
        <div className="mt-4">
          <QuickNav label={t('payment.PAYMENT_METHOD')} />
        </div>
        <div className='w-full'>
        <div className='mt-6 font-bold text-32 text-item'>{t('payment.PAYMENT_METHOD')}</div>
      </div>
      <div>
        <div>
          <span className='mt-6 font-bold text-24 text-item'>{t('payment.ACTIVE_RENTALS')}</span>
          <div>
            <span></span>
            <div>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Container>
  );
};

export default PaymentMethods;
