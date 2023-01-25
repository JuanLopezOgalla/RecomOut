import React, { FC, useEffect, useState } from 'react';
import styles from './AuthContainer.module.css';
import { cls } from '~/utils/functions';
import Container from '~/components/Screens/Container';
import Timer from '~/components/Screens/Timer';
import OptionButton from '~/components/Screens/OptionButton';
import { RoleType } from '~/components/Screens/OptionButton';
import PhoneNumber from '~/components/Screens/PhoneNumber';
import { GET_USER_QUERY, REGISTER_MUTATION } from '~/utils/graphql';
import Close from '~/public/icons/close.svg';
import InputMask from 'react-input-mask';
import { useTranslation } from 'next-export-i18n';
import { firebase, auth } from '~/utils/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setFbRefreshToken, setUser, setFbToken } from '~/store/app/actions';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { State } from '~/store/state';
import { ROLE } from '~/utils/constants';
import { notification } from 'antd';

interface AuthContainerProps {
  hideModal: () => void;
}

export type User = {
  firebaseUserId: string;
  phone: string;
  role: string;
  email: string;
  name: string;
};

enum AuthStep {
  SENDCODE = 'SENDCODE',
  CHECKCODE = 'CHECKCODE',
  SENDINFO = 'SENDINFO',
}

const AuthContainer: FC<AuthContainerProps> = (props: AuthContainerProps) => {
  const { hideModal } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchData = useSelector<State, State>(state => state);

  const roles: RoleType[] = [
    {
      label: t('auth.role.TENANT'),
      value: ROLE.TENANT,
    },
    {
      label: t('auth.role.AGENT'),
      value: ROLE.AGENT,
    },
    {
      label: t('auth.role.OWNER'),
      value: ROLE.OWNER,
    },
  ];

  const [role, setRole] = useState<RoleType>(roles[0]);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authStep, setAuthStep] = useState(AuthStep.SENDCODE);
  const [code, setCode] = useState('');
  const [final, setFinal] = useState<any>();
  const [visibleRecaptcha, setVisibleRecaptcha] = useState(false);
  const [isVerifiedToken, setIsVerifiedToken] = useState(false);
  const [newUser, setNewUser] = useState<User>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState(false);
  const [tooManyRequests, setTooManyRequests] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [notRegistered, setNotRegistered] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [tryLogin, setTryLogin] = useState(false);

  const userInfo = useQuery(GET_USER_QUERY, {
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      if (!data.me) {
        if (!isLogin) setAuthStep(AuthStep.SENDINFO);
        else {
          if (tryLogin) setNotRegistered(true);
        }
      } else {
        openNotification('Recom Authentication!', 'You are logged in Successfully.');
      }
    },
  });
  let verify = null;

  const [registerUser, { error }] = useMutation(REGISTER_MUTATION, {
    variables: newUser,
    update: (proxy, mutationResult) => {
      dispatch(setUser(mutationResult.data.register));
      hideModal();
      openNotification('Recom Authentication!', 'You are registered Successfully.');
    },
    onError: err => {
      if (err.message.includes('Firebase ID token has expired')) {
        getNewToken();
      }
    },
  });

  if (error) console.log(error.message, 'error.message');

  useEffect(() => {
    if (userInfo.data && userInfo.data.me) {
      if (isVerifiedToken) {
        dispatch(setUser(userInfo.data.me));
        if (!isLogin) {
          setAlreadyRegistered(true);
          setTimeout(() => {
            hideModal();
          }, 3000);
        } else hideModal();
      } else {
        if (searchData.app.user) hideModal();
      }

      setIsVerifiedToken(true);
    } else {
      if (isVerifiedToken) setAuthStep(AuthStep.SENDINFO);
    }
  }, [userInfo.data, isVerifiedToken]);

  useEffect(() => {
    if (userInfo.error && userInfo.error.message.includes('Firebase ID token has expired')) {
      getNewToken();
    }
  }, [userInfo.error]);

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
    setAuthError(false);
    setTooManyRequests(false);
    verify = null;
  };

  const checkActiveRole = (item: RoleType) => {
    let status = false;

    // role.forEach(el => {
    //   if (el.value === item.value) status = true;
    // });

    if (role && role.value === item.value) status = true;

    return status;
  };

  const selectItem = (item: React.SetStateAction<RoleType>) => {
    setRole(item);
  };

  const handleCode = e => {
    const { value, name } = e.target;
    const [fieldName, fieldIndex] = name.split('-');

    console.log(fieldName);

    if (value !== '' && value !== '_') {
      let currentCode = code;
      let index = parseInt(fieldIndex, 10) - 1;

      currentCode = currentCode.substring(0, index) + value + currentCode.substring(index + 1);
      setCode(currentCode);
      setWrongCode(false);

      const nextSibling = document.querySelector(`input[name=sms-${parseInt(fieldIndex, 10) + 1}]`);

      if (nextSibling !== null) {
        (nextSibling as HTMLElement)?.focus();
      }

      if (fieldIndex > 5) {
        setIsFinished(false);
        ValidateOtp(currentCode);
      }
    }
  };

  const resendCode = () => {
    setVisibleRecaptcha(false);

    setTimeout(() => {
      verify = new firebase.auth.RecaptchaVerifier('resend-recaptcha-container');

      auth
        .signInWithPhoneNumber(`${phoneCode} ${phoneNumber}`, verify)
        .then(result => {
          setFinal(result);
          setVisibleRecaptcha(true);
        })
        .catch(err => {
          console.log(err, 'err');
          setAuthError(true);
        });
    }, 500);
  };

  const signup = () => {
    try {
      registerUser();
    } catch (e) {
      console.error(e, 'Register Failed!');
      getNewToken();
    }
  };

  const login = () => {
    if (phoneNumber.length < 9) return;

    if (!verify) {
      verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');

      setTimeout(() => {
        auth
          .signInWithPhoneNumber(`${phoneCode} ${phoneNumber}`, verify)
          .then(result => {
            setFinal(result);
            setVisibleRecaptcha(true);
            setAuthStep(AuthStep.CHECKCODE);
            setNotRegistered(false);
          })
          .catch(err => {
            if (err.code === 'auth/too-many-requests') setTooManyRequests(true);
            else setAuthError(true);

            verify = null;
            setVisibleRecaptcha(true);
            setVisibleRecaptcha(false);
          });
      }, 500);
    }
  };

  const ValidateOtp = otpCode => {
    final
      .confirm(otpCode)
      .then(result => {
        const user = result.user;

        user.getIdToken().then(idToken => {
          console.log(idToken, userInfo, 'user');
          dispatch(setFbRefreshToken(result.user.refreshToken));
          dispatch(setFbToken(idToken));
          setIsFinished(true);
          setTryLogin(true);

          userInfo.refetch();
        });
      })
      .catch(err => {
        setIsFinished(true);
        if (err.code === 'auth/invalid-verification-code') {
          setWrongCode(true);
        }
      });
  };

  const handleName = (e: { target: { value: string } }) => {
    setName(e.target.value);
    handleUser(e.target.value, email);
  };

  const handleEmail = (e: { target: { value: string } }) => {
    setEmail(e.target.value);
    handleUser(name, e.target.value);
  };

  const handleUser = (name: string, email: string) => {
    const user = {
      firebaseUserId: '',
      email: email,
      name: name,
      phone: `${phoneCode} ${phoneNumber}`,
      role: role.value,
    };

    setNewUser(user);
  };

  const openNotification = (title: string, content: string) => {
    notification.open({
      message: title,
      description: content,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  return (
    <Container className="fixed sm:absolute z-50 left-0 top-0 w-full h-screen flex justify-center items-center">
      <div
        className={cls(['fixed left-0 bottom-0 right-0 top-0 opacity-100', styles.modalBackground])}
        onClick={hideModal}
      ></div>
      <div className={cls(['w-modal bg-white z-10 py-12 px-8 relative rounded-md', styles.modalWrap])}>
        <a className="absolute top-10 sm:top-3 right-3" href="#">
          <Close className="w-close" onClick={hideModal} />
        </a>
        <img src="/images/auth-logo.png" className="block sm:hidden mb-12" />
        <div className="flex justify-center">
          <img src="/images/auth-back.png" className="rounded-full" />
        </div>
        <div className="mt-14">
          {authStep === AuthStep.SENDCODE ? (
            <>
              {!isLogin && (
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((el, key) => (
                    <OptionButton item={el} key={key} active={checkActiveRole(el)} selectItem={selectItem} />
                  ))}
                </div>
              )}
              <div className="mt-9">
                <PhoneNumber
                  code={phoneCode}
                  number={phoneNumber}
                  changeCode={handlePhoneCode}
                  changeNumber={handlePhoneNumber}
                  type="auth"
                />
              </div>
              {!visibleRecaptcha && <div id="recaptcha-container" className="pt-4 flex justify-center"></div>}
              {authError && <div className="text-12 text-danger font-medium mt-2">{t('auth.FIREBASE_ERROR')}</div>}
              {tooManyRequests && (
                <div className="text-12 text-danger font-medium">{t('auth.TOOMANYREQUESTS_ERROR')}</div>
              )}
              <button
                className="w-full bg-black text-14 text-white font-bold uppercase py-4 rounded-32 mt-8"
                onClick={() => {
                  login();
                }}
              >
                {isLogin ? t('auth.LOGIN') : t('auth.SIGNUP')}
              </button>
              {isLogin ? (
                <div className="text-right pt-2 text-14 font-medium">
                  {t('auth.NOT_ACCOUNT')}
                  <span
                    className="text-auth cursor-pointer ml-2"
                    onClick={() => {
                      setIsLogin(false);
                    }}
                  >
                    {t('auth.SIGNUP')}
                  </span>
                </div>
              ) : (
                <div className="text-right pt-2 text-14 font-medium">
                  {t('auth.ALREADY_ACCOUNT')}
                  <span
                    className="text-auth cursor-pointer capitalize ml-2"
                    onClick={() => {
                      setIsLogin(true);
                    }}
                  >
                    {t('auth.LOGIN')}
                  </span>
                </div>
              )}
            </>
          ) : authStep === AuthStep.CHECKCODE ? (
            <>
              <div className="text-24 font-bold">{t('auth.ENTER_CODE')}</div>
              <div className="grid grid-cols-6 gap-2 mt-8">
                {[...Array(6)].map((elementInArray, index) => (
                  <InputMask
                    mask="9"
                    className={cls([
                      'border px-4 border-solid py-4 rounded-32 text-20 font-semibold',
                      code[index] === '' ? 'border-authBorder' : 'border-activeBorder',
                    ])}
                    name={'sms-' + (index + 1)}
                    onChange={handleCode}
                  />
                ))}
              </div>
              {!visibleRecaptcha && <div id="resend-recaptcha-container" className="pt-4 flex justify-center"></div>}
              {wrongCode && <div className="text-12 text-danger font-medium mt-2">{t('auth.WRONG_CODE')}</div>}
              {alreadyRegistered && (
                <div className="text-12 text-danger font-medium mt-2">{t('auth.ALREADY_REGISTERED')}</div>
              )}
              {notRegistered && <div className="text-12 text-danger font-medium mt-2">{t('auth.NOT_REGISTERED')}</div>}
              <div className="flex justify-between mt-8">
                <button
                  className="flex pt-2 text-14 font-normal border border-black border-solid my-2 rounded-32 px-4"
                  onClick={resendCode}
                >
                  <div className="mr-2">{t('auth.RESEND_CODE')}</div>
                  <Timer initialSeconds={100} handleCycle={resendCode} />
                </button>
                <button
                  className="bg-black text-14 text-white font-bold uppercase py-4 px-12 rounded-32"
                  onClick={() => {
                    setVisibleRecaptcha(false);
                    setAuthStep(AuthStep.SENDCODE);
                  }}
                  disabled={!isFinished}
                >
                  {t('auth.BACK')}
                  {!isFinished && <i className="fa fa-spinner fa-spin ml-2"></i>}
                </button>
              </div>
            </>
          ) : authStep === AuthStep.SENDINFO ? (
            <>
              <input
                type="text"
                className="border border-authBorder border-solid p-4 text-14 font-medium w-full rounded-32"
                placeholder={t('auth.YOUR_NAME')}
                onChange={handleName}
              />
              <input
                type="email"
                className="border border-authBorder border-solid p-4 text-14 font-medium w-full rounded-32 mt-4"
                placeholder={t('auth.YOUR_EMAIL')}
                onChange={handleEmail}
              />
              <button
                className="w-full bg-black text-14 text-white font-bold uppercase py-4 rounded-32 mt-8"
                onClick={signup}
              >
                {t('auth.SIGNUP')}
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Container>
  );
};

export default AuthContainer;
