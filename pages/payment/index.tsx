import React, { FC, useState } from 'react';
import Container from '~/components/Screens/Container';
import QuickNav from '~/components/QuickNav';
import Selected from '~/public/icons/paymentSelected.svg';
import DocIcon from '~/public/icons/doc.svg';
import UnSel from '~/public/icons/UnSel.svg';
import Sel from '~/public/icons/Sel.svg';
import Sign from '~/public/icons/sign.svg';
import { useSelector } from 'react-redux';
import { State } from '~/store/state';
import { useTranslation } from 'next-export-i18n';
import styles from './Payment.module.css';
import { cls, getHalfYearPrice, getPeriodPrice, getPrice, getQuartelyPrice, getYearPrice } from '~/utils/functions';
import { NextSeo } from 'next-seo';
import { Button } from 'antd';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '~/components/Screens/CheckoutForm';

export type RentPaymentType = 'MONTHLY' | 'QUARTELY' | 'HALF_YEAR' | 'YEARLY' | 'Period';

const Payment: FC = () => {
  const { t } = useTranslation();
  const searchData = useSelector<State, State>(state => state);
  const hit = searchData.app.hit;

  const [security, setSecurity] = useState(false);
  const [commission, setCommission] = useState(false);
  const [rentAgreeMent, setRentAgreeMent] = useState(false);
  const [signContract, setSignContract] = useState(false);
  const [rentPayment, setRentPayment] = useState<{ type: RentPaymentType; price: number }>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [isCheckout, setCheckout] = useState(false);
  const price = hit ? getPrice(hit.amount, searchData.app.rates[searchData.app.currency.toUpperCase()]) : 0;

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const onChange = dates => {
    const [start, end] = dates;
    const diff = moment(end).diff(moment(start), 'days');

    setStartDate(start);
    setEndDate(end);
    setRentPayment({ type: 'Period', price: getPeriodPrice(price, diff) });
  };

  const securityFunc = () => {
    security === true ? setSecurity(false) : setSecurity(true);
  };

  const commissionFunc = () => {
    commission === true ? setCommission(false) : setCommission(true);
  };

  const rentRentAgreementFunc = () => {
    rentAgreeMent === true ? setRentAgreeMent(false) : setRentAgreeMent(true);
  };

  const signContractFunc = () => {
    signContract === true ? setSignContract(false) : setSignContract(true);
  };

  const handleNext = () => {
    setCheckout(true);
  };

  const handleRentPayment = (rentPaymentItem: { type: RentPaymentType; price: number }) => {
    setRentPayment(rentPaymentItem);
  };

  const renderRentPayment = (rentPaymentItem: { type: RentPaymentType; price: number }) => (
    <div
      className={cls([
        'relative w-5/12 bg-white rounded-lg cursor-pointer',
        rentPaymentItem.type === rentPayment?.type ? 'border  border-solid border-blue-400 ' : '',
      ])}
      onClick={() => handleRentPayment(rentPaymentItem)}
    >
      {rentPaymentItem.type === 'QUARTELY' ? (
        <div className="w-full h-full absolute grid justify-items-stretch">
          <div
            className={cls([
              'rounded-full absolute justify-self-center bottom-18 w-2/5 h-1/3',
              styles.discountgradient,
            ])}
          >
            <div className="mt-2 text-xs text-center text-white">
              {'5%'} {t('payment.DISCOUNT')}
            </div>
          </div>
        </div>
      ) : null}
      <div className="text-20 p-2 text-center font-bold">
        <div className="flex flex-row-reverse">
          <Selected
            className={cls([rentPaymentItem.type === rentPayment?.type ? 'absolute justify-self-end' : 'hidden'])}
          />
        </div>
        {t('payment.' + rentPaymentItem.type)}
      </div>
      <div className="text-16 text-center font-bold mb-3"> {`${rentPaymentItem.price} AED`}</div>
    </div>
  );

  const renderSecurityDeposit = (price: number) => (
    <div
      className={cls([
        'grid justify-items-stretch mt-4 w-10/12  bg-white rounded-lg cursor-pointer',
        security === true ? 'border  border-solid border-blue-400 ' : '',
      ])}
      onClick={() => {
        securityFunc();
      }}
    >
      <div className="text-18 p-5 text-left font-bold justify-self-start">{t('payment.SECIRITY')}</div>
      <div className="absolute justify-self-end mt-5 mr-3 flex flex-row ">
        <div
          className={cls(['mr-5 rounded-full text-xs text-white text-center p-2  mb-2', styles.securityagentgradient])}
        >
          {t('payment.FOR_AGENT')}
        </div>
        <div className="font-bold text-18"> {price} </div> <div className="text-15 p-1">{' AED'}</div>
      </div>
    </div>
  );

  const renderCommission = (price: number) => (
    <div
      className={cls([
        'grid justify-items-stretch mt-4 w-10/12  bg-white rounded-lg cursor-pointer',
        commission === true ? 'border  border-solid border-blue-400 ' : '',
      ])}
      onClick={() => {
        commissionFunc();
      }}
    >
      <div className="text-18 p-5 text-left font-bold justify-self-start">{t('payment.COMMISSION')}</div>
      <div className="absolute justify-self-end mt-5 mr-3 flex flex-row ">
        <div
          className={cls([
            'mr-5 rounded-full text-xs text-white text-center p-2  mb-2',
            styles.commissionrefundgradient,
          ])}
        >
          {t('payment.REFUND')}
        </div>
        <div className="font-bold text-18"> {price} </div> <div className="text-15 p-1">{' AED'}</div>
      </div>
    </div>
  );

  const renderRentalAgreeMent = () => (
    <div
      className={cls(['relative grid justify-items-stretch mt-4 w-10/12  bg-white rounded-lg cursor-pointer'])}
      onClick={() => {
        rentRentAgreementFunc();
      }}
    >
      <div className="mt-3 mb-3 ml-3 justify-self-start flex flex-row">
        <DocIcon />
        <div className="mt-3 ml-3 text-blue-400 text-left underline underline-offset-1">
          {t('payment.RENTAL_AGREEMENT')}
        </div>
      </div>
      {rentAgreeMent === true ? (
        <UnSel className="absolute justify-self-end mt-5 mr-3" />
      ) : (
        <Sel className="absolute justify-self-end mt-5 mr-3" />
      )}
    </div>
  );

  const renderSignContract = () => (
    <div
      className={cls(['relative grid justify-items-stretch mt-4 w-10/12  bg-white rounded-lg cursor-pointer'])}
      onClick={() => {
        signContractFunc();
      }}
    >
      <div className="mt-4 mb-3 ml-3 justify-self-start flex flex-row">
        <Sign />
        <div className="mt-1 mb-3 ml-3 text-blue-400 text-left underline underline-offset-1">
          {t('payment.SIGN_CONTRACT')}
        </div>
      </div>
      {signContract === true ? (
        <UnSel className="absolute justify-self-end mt-4 mr-3" />
      ) : (
        <Sel className="absolute justify-self-end mt-5 mr-3" />
      )}
    </div>
  );

  const renderPayment = () => {
    return (
      <>
        <div className="mt-8">
          <div>
            <div className="text-20 text-item font-bold">{t('payment.RENT_PERIOD')}</div>
            <div className="w-full md:flex justify-between mt-5 mb-5">
              <DatePicker
                focusSelectedMonth={false}
                startDate={startDate}
                endDate={endDate}
                monthsShown={2}
                selectsRange
                inline
                minDate={moment().toDate()}
                disabledKeyboardNavigation // <-- active-day bug is still open
                onChange={onChange}
              />
            </div>
            <div>
              <div className="mt-6 text-20 text-item font-bold">{t('payment.RENT_PAYMENT')}</div>
              <div className="w-full mt-4 flex flex-col space-y-5">
                <div className="flex space-x-5">
                  {renderRentPayment({ type: 'MONTHLY', price })}
                  {renderRentPayment({ type: 'QUARTELY', price: getQuartelyPrice(price) })}
                </div>
                <div className="flex space-x-5">
                  {renderRentPayment({ type: 'HALF_YEAR', price: getHalfYearPrice(price) })}
                  {renderRentPayment({ type: 'YEARLY', price: getYearPrice(price) })}
                </div>
              </div>

              <div>
                <div className="mt-6 text-20 text-item font-bold">{t('payment.ONE_TIME')}</div>
                {renderSecurityDeposit(3500)}
                {renderCommission(3500)}
              </div>

              <div>
                <div className="mt-6 text-20 text-item font-bold">{t('payment.REVIEW_CONTRACT')}</div>
                {renderRentalAgreeMent()}
              </div>

              <div>
                <div className="mt-6 text-20 text-item font-bold">{t('payment.SIGN_CONTRACT')}</div>
                {renderSignContract()}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 w-40">
          <Button type="primary" onClick={handleNext} size="middle" block>
            {t('post.NEXT')}
          </Button>
        </div>
      </>
    );
  };

  const renderCheckout = () => {
    let rentStartDate = moment().toDate();
    let rentEndDate: Date;

    switch (rentPayment?.type) {
      case 'HALF_YEAR':
        rentEndDate = moment().add(180, 'days').toDate();
        break;
      case 'MONTHLY':
        rentEndDate = moment().add(30, 'days').toDate();
        break;
      case 'QUARTELY':
        rentEndDate = moment().add(90, 'days').toDate();
        break;
      case 'YEARLY':
        rentEndDate = moment().add(365, 'days').toDate();
        break;
      default:
        rentStartDate = startDate;
        rentEndDate = endDate;
    }

    if (hit.listingType === 'buy') {
      rentStartDate = undefined;
      rentEndDate = undefined;
    }

    return (
      <>
        <div className="mt-8 flex flex-row w-full justify-content items-center">
          <i className="fa fa-arrow-left cursor-pointer" onClick={() => setCheckout(false)} />
          <span className="text-22 text-black font-bold ml-2 mr-3">{t('checkout.TOTAL_PRICE')}</span>
          <p className="text-18 text-black font-medium mb-0">
            <span className="font-bold">{rentPayment?.price}</span> {hit?.amountCurrency}
          </p>
        </div>
        <div className="mt-3">
          <Elements stripe={stripePromise}>
            <CheckoutForm type={rentPayment?.type} start={rentStartDate} end={rentEndDate} />
          </Elements>
        </div>
      </>
    );
  };

  return (
    <Container className="itemContainer pt-24 px-10 bg-listBackground flex justify-center">
      <NextSeo title="RECOM Payment Detail" description="RECOM Payment Detail." />
      <div className="w-full sm:w-newProperty mt-7">
        <div className="mt-4">
          <QuickNav label={`${hit ? hit.property.building.district : ''}, ${hit ? hit.property.building.city : ''}`} />
        </div>
        <div className={cls(['mt-6 font-bold text-32 text-item'])}>{t('payment.PAYMENT_TITLE')}</div>

        {hit?.listingType === 'buy' || isCheckout ? renderCheckout() : renderPayment()}
      </div>
    </Container>
  );
};

export default Payment;
