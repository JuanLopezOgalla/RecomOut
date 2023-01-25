import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, notification, Form, Input } from 'antd';
import { useTranslation } from 'next-export-i18n';
import { RentPaymentType } from '~/pages/payment';
import { CREATE_ONE_TIME_PAYMENT, CREATE_USER_CHECKOUT, CREATE_USER_SUBSCRIPTION } from '~/utils/graphql';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { State } from '~/store/state';
import moment from 'moment';

export type Checkout = {
  email: string;
  name: string;
  card: string;
  date: string;
  cvc: string;
  country: string;
  zip: string;
};

export default function CheckoutForm({ type, start, end }: { type?: RentPaymentType; start?: Date; end?: Date }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const searchData = useSelector<State, State>(state => state);
  const hit = searchData.app.hit;

  const openNotification = (success: boolean) => {
    if (success) {
      notification.open({
        key: 'payment_success',
        message: 'Payment Success',
        description: 'You purchased the item successfully.',
      });
    } else {
      notification.open({
        key: 'payment_failed',
        message: 'Payment Failure',
        description: 'Your payment was failed unexpectedly. Sorry!!!',
      });
    }
  };

  const [createUserSubscription] = useMutation(CREATE_USER_SUBSCRIPTION, {
    update: (_, mutationResult) => {
      handlePaymentIntegration(mutationResult.data.createUserSubscription.clientSecret);
    },
    onError: () => {
      openNotification(false);
    },
  });

  const [createOneTimePayment] = useMutation(CREATE_ONE_TIME_PAYMENT, {
    variables: { listingId: hit.id, duration: moment(end).diff(moment(start), 'days') },
    update: (_, mutationResult) => {
      handlePaymentIntegration(mutationResult.data.createOnetimePayment.clientSecret);
    },
    onError: () => {
      openNotification(false);
    },
  });

  const [createUserCheckout] = useMutation(CREATE_USER_CHECKOUT, {
    update: (_, mutationResult) => {
      handlePaymentIntegration(mutationResult.data.createUserCheckout.clientSecret);
    },
    onError: () => {
      openNotification(false);
    },
  });

  const handlePaymentIntegration = async (clientSecret: string) => {
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });

    setLoading(false);

    if (error) {
      openNotification(false);
      return;
    }

    openNotification(true);
  };

  const handleSubmit = async (values: Checkout) => {
    if (loading) return;

    setLoading(true);

    const paymentMethodReq = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        address: {
          city: values.country,
          line1: values.country,
          postal_code: values.zip,
          state: values.country,
        },
        email: values.email,
        name: values.name,
        phone: '555-555-5555',
      },
    });

    if (paymentMethodReq.error) {
      openNotification(false);
      setLoading(false);
      return;
    }

    setPaymentMethod(paymentMethodReq.paymentMethod.id);

    if (hit.listingType === 'rent') {
      if (type === 'Period') {
        // One time payment
        createOneTimePayment();
      } else {
        // Subscription
        createUserSubscription({
          variables: {
            listingId: hit.id,
            fromDate: moment(start).format('YYYY-MM-DD'),
            toDate: moment(end).format('YYYY-MM-DD'),
          },
        });
      }
    } else {
      createUserCheckout({ variables: { listingId: hit.id } });
    }
  };

  return (
    <React.Fragment>
      <Form name="checkout" onFinish={handleSubmit} autoComplete="off">
        <div className="grid grid-cols-1 mb-5">
          <Form.Item label="" name="email" rules={[{ required: true, message: t('checkout.REQUIRED_EMAIL') }]}>
            <Input type="email" size={'large'} placeholder={t('checkout.EMAIL')} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 mb-5">
          <Form.Item label="" name="name" rules={[{ required: true, message: t('checkout.REQUIRED_NAME') }]}>
            <Input type="text" size={'large'} placeholder={t('checkout.NAME')} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 mb-5">
          <CardElement />
        </div>
        <hr className="mb-4" />

        <div className="mt-8">
          <Button type="primary" htmlType="submit">
            {t('item.SUBMIT')}
          </Button>
        </div>
      </Form>
    </React.Fragment>
  );
}
