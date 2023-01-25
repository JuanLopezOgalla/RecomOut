import React, { useState } from 'react';
import Container from '~/components/Screens/Container';
import PhoneNumber from '~/components/Screens/PhoneNumber';
import { ContactUs } from '../agent/index';
import { CREATE_CONTACTUS_OWNER_MUTATION } from '~/utils/graphql';
import { Form, Input, Button, Select, Alert } from 'antd';
import { useTranslation } from 'next-export-i18n';
import { defaultCities } from '~/utils/constants';
import phonecodes, { getIndexOfCountry } from '~/utils/phonecodes';
import { useMutation } from '@apollo/client';
import { firebase } from '~/utils/firebase';
import { useDispatch } from 'react-redux';
import { setFbToken } from '~/store/app';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

const SellProperties = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const { Option } = Select;
  const { TextArea } = Input;

  const [phoneCode, setPhoneCode] = useState(`(${phonecodes[getIndexOfCountry('United Arab Emirates')].dial_code})`);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newContactUs, setNewContactUs] = useState<ContactUs>();
  const [isLoading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [createContactUs] = useMutation(CREATE_CONTACTUS_OWNER_MUTATION, {
    variables: newContactUs,
    update: () => {
      setLoading(false);
      setSent(true);
    },
    onError: err => {
      if (err.message.includes('Firebase ID token has expired')) {
        getNewToken();
      }
    },
  });

  const getNewToken = () => {
    firebase
      .auth()
      .currentUser?.getIdToken(true)
      .then(idToken => {
        dispatch(setFbToken(idToken));
        router.reload();
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  const handlePhoneCode = (value: string) => {
    setPhoneCode(value);
  };

  const handlePhoneNumber = (value: string) => {
    setPhoneNumber(value);
  };

  const onFinish = (values: ContactUs) => {
    setLoading(true);
    const code = phoneCode.split('-');
    const constactUs = {
      ...values,
      phone: `${code[0]} ${phoneNumber}`,
    };

    setNewContactUs(constactUs);

    try {
      createContactUs();
    } catch (e) {
      console.log(e, 'error');
      getNewToken();
    }
  };

  return (
    <Container className="mainContainer propertyContainer bg-listBackground">
      <NextSeo title="Sell Property of RECOM" description="Sell Property of RECOM." />
      <div className="w-full lg:flex">
        <div className="lg:w-1/2">
          <video width="100%" height="100%" loop autoPlay muted>
            <source src="/videos/RECOM.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center">
          <div className="w-full lg:w-sellProperty">
            <div className="mt-8 flex justify-between">
              <h1 className="text-40 text-item font-bold">{t('header.SELL_YOUR_PROPERTY')}</h1>
            </div>
            <div className="mt-4">
              <Form
                name="properties"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <div className="sm:flex">
                  <div className="sm:w-1/2 sm:pr-1">
                    <Form.Item
                      label=""
                      name="firstName"
                      rules={[{ required: true, message: t('properties.REQUIRED_FIRSTNAME') }]}
                    >
                      <Input type="text" size={'large'} placeholder={t('properties.FIRSTNAME')} />
                    </Form.Item>
                  </div>
                  <div className="sm:w-1/2 sm:pl-1 mt-4 sm:mt-0">
                    <Form.Item
                      label=""
                      name="lastName"
                      rules={[{ required: true, message: t('properties.REQUIRED_SECONDNAME') }]}
                    >
                      <Input type="text" size={'large'} placeholder={t('properties.SECONDNAME')} />
                    </Form.Item>
                  </div>
                </div>
                <div className="mt-4">
                  <Form.Item
                    label=""
                    name="phoneNumber"
                    // rules={[{ required: true, message: t('properties.REQUIRED_PHONENUMBER') }]}
                  >
                    <PhoneNumber
                      code={phoneCode}
                      number={phoneNumber}
                      changeCode={handlePhoneCode}
                      changeNumber={handlePhoneNumber}
                      type="properties"
                    />
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item
                    label=""
                    name="email"
                    rules={[{ required: true, message: t('properties.REQUIRED_EMAIL') }]}
                  >
                    <Input type="email" size={'large'} placeholder={t('properties.EMAIL')} />
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label="" name="city" rules={[{ required: true, message: t('properties.REQUIRED_CITY') }]}>
                    <Select showSearch placeholder={t('properties.CITY')}>
                      {defaultCities &&
                        defaultCities.map((city, key) => (
                          <Option value={city} key={key}>
                            {city}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="mt-4">
                  <Form.Item label="" name="note" rules={[{ required: true, message: t('properties.REQUIRED_NOTE') }]}>
                    <TextArea placeholder={t('properties.NOTE')} autoSize={{ minRows: 4, maxRows: 12 }} />
                  </Form.Item>
                </div>
                {sent && (
                  <div className="mt-4">
                    <Alert message={t('agent.NOTIFICATION_CONTENT')} type="success" />
                  </div>
                )}
                <div className="mt-8 flex justify-end">
                  <Button type="primary" htmlType="submit" loading={isLoading} disabled={sent}>
                    {t('properties.SEND')}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SellProperties;
