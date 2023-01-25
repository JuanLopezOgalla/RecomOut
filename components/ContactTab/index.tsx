import React, { FC, useState, useEffect } from 'react';
import Container from '~/components/Screens/Container';
import PhoneNumber from '~/components/Screens/PhoneNumber';
import {
  CREATE_LISTING_CONTACTUS_MUTATION,
  CREATE_VIEWING_CONTACTUS_MUTATION,
  CREATE_OFFER_CONTACTUS_MUTATION,
} from '~/utils/graphql';
import phonecodes, { getIndexOfCountry } from '~/utils/phonecodes';
import { Input, Button, Calendar, Form, Alert } from 'antd';
import { useTranslation } from 'next-export-i18n';
import { cls, getTimeArray, getDateOfToday, getCurrentMonthAsString, formatDateNumber } from '~/utils/functions';
import { defaultCountry } from '~/utils/constants';
import { firebase } from '~/utils/firebase';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { setFbToken } from '~/store/app/actions';
import { useDispatch } from 'react-redux';

enum USERACTION {
  CONTACT_AGENT = 'CONTACT_AGENT',
  BOOK_A_VIEWING = 'BOOK_A_VIEWING',
  MAKE_AN_OFFER = 'MAKE_AN_OFFER',
}

type ContactUs = {
  firstName: string;
  lastName: string;
  email: string;
  note: string;
};

const ContactTab: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { TextArea } = Input;

  const timeArray: string[] = getTimeArray();

  const [userAction, setUserAction] = useState<string>(USERACTION.CONTACT_AGENT);
  const [bookingDate, setBookingDate] = useState(getDateOfToday());
  const [bookingTime, setBookingTime] = useState(timeArray[0]);
  const [offerAmount, setOfferAmount] = useState<number>();
  const [phoneCode, setPhoneCode] = useState(`(${phonecodes[getIndexOfCountry(defaultCountry)].dial_code})`);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newContactUs, setNewContactUs] = useState<ContactUs>();
  const [isLoading, setLoading] = useState(false);
  const [viewingSent, setViewingSent] = useState(false);
  const [offerSent, setOfferSent] = useState(false);

  useEffect(() => {
    if (userAction === USERACTION.CONTACT_AGENT) {
      const script = document.createElement('script');

      script.innerHTML = `
        (function (w,d,s,o,f,js,fjs) {
            w['StoreOneTalk']=o; w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
            js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
            js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
        }(window, document, 'script', 'mwsat', 'https://consultant.storeone.com/lab/recom-talk.min.js'));
        mwsat('ios-plugin-video-swatch', 'A5MmiidbpV34WfH4R0eB', {});
      `;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [userAction]);

  const [createListingContactUs] = useMutation(CREATE_LISTING_CONTACTUS_MUTATION, {
    variables: newContactUs,
    update: (proxy, mutationResult) => {
      console.log('Create Listing ContactUs Result: ', proxy, mutationResult.data.createContactUs.id);
    },
  });

  const [createViewingContactUs] = useMutation(CREATE_VIEWING_CONTACTUS_MUTATION, {
    variables: newContactUs,
    update: () => {
      setLoading(false);
      setViewingSent(true);
    },
    onError: err => {
      if (err.message.includes('Firebase ID token has expired')) {
        getNewToken();
      }
    },
  });

  const [createOfferContactUs] = useMutation(CREATE_OFFER_CONTACTUS_MUTATION, {
    variables: newContactUs,
    update: () => {
      setLoading(false);
      setOfferSent(true);
    },
    onError: err => {
      if (err.message.includes('Firebase ID token has expired')) {
        getNewToken();
      }
    },
  });

  const handleUserAction = (value: string) => {
    setUserAction(value);
  };

  const handelDate = (value: moment.Moment) => {
    setBookingDate(`${value.year()}-${formatDateNumber(value.month() + 1)}-${formatDateNumber(value.date())}`);
  };

  const handleTime = (value: string) => {
    setBookingTime(value);
  };

  const handleOfferAmount = (e: { target: { value: string } }) => {
    setOfferAmount(parseInt(e.target.value));
  };

  const handlePhoneCode = (value: string) => {
    setPhoneCode(value);
  };

  const handlePhoneNumber = (value: string) => {
    setPhoneNumber(value);
  };

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

  const onFinish = (values: ContactUs) => {
    setLoading(true);
    const code = phoneCode.split('-');
    const constactUs = {
      ...values,
      phone: `${code[0]} ${phoneNumber}`,
    };

    let newConstactUs;

    try {
      if (userAction === USERACTION.CONTACT_AGENT) {
        newConstactUs = constactUs;

        setNewContactUs(newConstactUs);

        createListingContactUs();
      } else if (userAction === USERACTION.BOOK_A_VIEWING) {
        newConstactUs = {
          ...constactUs,
          viewingDate: `${bookingDate} ${bookingTime}`,
        };

        setNewContactUs(newConstactUs);

        createViewingContactUs();
      } else if (userAction === USERACTION.MAKE_AN_OFFER) {
        newConstactUs = {
          ...constactUs,
          offerAmount: offerAmount,
          currency: 'AED',
        };

        setNewContactUs(newConstactUs);

        createOfferContactUs();
      }
    } catch (e) {
      console.log(e, 'error');

      getNewToken();
    }
  };

  return (
    <Container className="propertyContainer">
      <div className="flex">
        <div
          className={cls([
            'text-16 text-black font-medium cursor-pointer w-1/3 text-center border-solid border-black pb-4',
            userAction === USERACTION.CONTACT_AGENT
              ? 'border-b-4 font-bold border-opacity-30'
              : 'border-b border-opacity-10',
          ])}
          onClick={() => {
            handleUserAction(USERACTION.CONTACT_AGENT);
          }}
        >
          {t('item.CONTACT_AGENT')}
        </div>
        <div
          className={cls([
            'text-16 text-black font-medium cursor-pointer w-1/3 text-center border-solid border-black pb-4',
            userAction === USERACTION.BOOK_A_VIEWING
              ? 'border-b-4 font-bold border-opacity-30'
              : 'border-b border-opacity-10',
          ])}
          onClick={() => {
            handleUserAction(USERACTION.BOOK_A_VIEWING);
          }}
        >
          {t('item.BOOK_A_VIEWING')}
        </div>
        <div
          className={cls([
            'text-16 text-black font-medium cursor-pointer w-1/3 text-center border-solid border-black pb-4',
            userAction === USERACTION.MAKE_AN_OFFER
              ? 'border-b-4 font-bold border-opacity-30'
              : 'border-b border-opacity-10',
          ])}
          onClick={() => {
            handleUserAction(USERACTION.MAKE_AN_OFFER);
          }}
        >
          {t('item.MAKE_AN_OFFER')}
        </div>
      </div>
      <div className="pt-8 listingContainer">
        {userAction === USERACTION.CONTACT_AGENT ? (
          <div id="contactModal"></div>
        ) : (
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
              <Form.Item label="" name="email" rules={[{ required: true, message: t('properties.REQUIRED_EMAIL') }]}>
                <Input type="email" size={'large'} placeholder={t('properties.EMAIL')} />
              </Form.Item>
            </div>
            <div className="mt-4">
              <Form.Item label="" name="note" rules={[{ required: true, message: t('properties.REQUIRED_NOTE') }]}>
                <TextArea placeholder={t('properties.NOTE')} autoSize={{ minRows: 4, maxRows: 12 }} />
              </Form.Item>
            </div>
            <div className="">
              {
                // userAction === USERACTION.CONTACT_AGENT ? (
                //   <div className="mt-4 py-4 border border-solid border-black border-opacity-10 rounded-lg">
                //     <ChatBox />
                //   </div>
                // ) :
                userAction === USERACTION.BOOK_A_VIEWING ? (
                  <>
                    <div className="datePickerWrap mt-4 sm:flex p-4 border border-solid border-black border-opacity-10 rounded-lg">
                      <div className="w-full sm:w-2/3 pr-4">
                        <div className="text-18 text-item font-semibold mb-2 pt-2">
                          <span className="font-bold mr-1">{getCurrentMonthAsString()}, </span>
                          <span className="">{new Date().getFullYear()}</span>
                        </div>
                        <Calendar fullscreen={false} onSelect={handelDate} />
                      </div>
                      <div className="w-full sm:w-1/3 pt-4 sm:pt-1">
                        <ul className="overflow-y-auto h-72 pr-2 mb-0">
                          {timeArray.map((time, key) => (
                            <li
                              className={cls([
                                'w-full rounded-lg mb-1 border border-solid border-black border-opacity-10 text-12 p-2 text-center font-medium cursor-pointer',
                                bookingTime === time ? 'bg-black text-white' : 'text-item',
                              ])}
                              key={key}
                              onClick={() => handleTime(time)}
                            >
                              {time}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {viewingSent && (
                      <div className="mt-4">
                        <Alert message={t('agent.NOTIFICATION_CONTENT')} type="success" />
                      </div>
                    )}
                  </>
                ) : userAction === USERACTION.MAKE_AN_OFFER ? (
                  <div className="pt-4">
                    <Input
                      className="offerInput"
                      type="number"
                      value={offerAmount}
                      onChange={handleOfferAmount}
                      size={'large'}
                      placeholder={t('listing.AMOUNT')}
                    />
                    {offerSent && (
                      <div className="mt-4">
                        <Alert message={t('agent.NOTIFICATION_CONTENT')} type="success" />
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )
              }
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="primary" htmlType="submit" loading={isLoading} disabled={viewingSent || offerSent}>
                {t('item.SEND_INQUIRY')}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default ContactTab;
