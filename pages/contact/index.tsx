import React, { useState } from 'react';
import Container from '~/components/Screens/Container';
import PhoneNumber from '~/components/Screens/PhoneNumber';
import { CREATE_CONTACTUS_GENERAL_MUTATION } from '~/utils/graphql';
import { Form, Input, Button, Alert } from 'antd';
import { useTranslation } from 'next-export-i18n';
import { defaultCountry } from '~/utils/constants';
import phonecodes, { getIndexOfCountry } from '~/utils/phonecodes';
import { useMutation } from '@apollo/client';
import { firebase } from '~/utils/firebase';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setFbToken } from '~/store/app/actions';
import { NextSeo } from 'next-seo';

export type ContactUs = {
  firstName: string;
  lastName: string;
  email: string;
  note: string;
};

const Contact = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { TextArea } = Input;

  const [phoneCode, setPhoneCode] = useState(`(${phonecodes[getIndexOfCountry(defaultCountry)].dial_code})`);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newContactUs, setNewContactUs] = useState<ContactUs>();
  const [isLoading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [createContactUs] = useMutation(CREATE_CONTACTUS_GENERAL_MUTATION, {
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
      <NextSeo title="Contact to RECOM" description="Contact to RECOM." />
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
              <h1 className="text-40 text-item font-bold">{t('contact.TITLE')}</h1>
            </div>
            <div className="mt-4">
              <Form
                name="contact"
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
                  <Form.Item label="" name="phoneNumber">
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
                  <Form.Item label="" name="note" rules={[{ required: true, message: t('contact.REQUIRED_MESSAGE') }]}>
                    <TextArea placeholder={t('contact.MESSAGE')} autoSize={{ minRows: 4, maxRows: 12 }} />
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

export default Contact;
