import React, { useState } from 'react';
import Container from '~/components/Screens/Container';
import HomePost from '~/components/Screens/HomePost';
import { Input, Button } from 'antd';
import Newhome from '~/public/icons/newhome.svg';
import { ROUTES } from '~/utils/routes';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useRouter } from 'next/router';
import styles from './Profile.module.css';
import { cls } from '~/utils/functions';
import { State } from '~/store/state';
import { useSelector } from 'react-redux';
import { NextSeo } from 'next-seo';

const Profile = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const searchData = useSelector<State, State>(state => state);

  const [isEditable, setIsEditable] = useState(false);
  const [visibleRental, setVisibleRental] = useState(false);
  const [avatar, setAvatar] = useState<File>(null);
  const [id, setId] = useState<File>(null);
  const [name, setName] = useState(searchData.app.user ? searchData.app.user.name : '');
  const [phone, setPhone] = useState(searchData.app.user ? searchData.app.user.phone : '');
  const [email, setEmail] = useState(searchData.app.user ? searchData.app.user.email : '');

  const hits = [];

  const handleEdit = () => {
    setIsEditable(prevIsEditable => !prevIsEditable);
  };

  const handleAvatar = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      setAvatar(img);
    }
  };

  const handleId = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      setId(img);
    }
  };

  const handlePayment = () => {
    router.push(`${ROUTES.PAYMENT}?lang=${query.lang}`);
  };

  const handleName = event => {
    setName(event.target.value);
  };

  const handlePhone = event => {
    setPhone(event.target.value);
  };

  const handleEmail = event => {
    setEmail(event.target.value);
  };

  const viewHomes = () => {
    setVisibleRental(true);
  };

  return (
    <Container className="profileContainer pt-24 bg-listBackground flex justify-center pb-20 border-b border-solid border-black border-opacity-10">
      <NextSeo title="RECOM User Profile" description="RECOM User Profile." />
      <div className="w-full sm:w-newProperty px-4 sm:px-0">
        <div className="mt-8 flex justify-between">
          <h1 className="text-40 text-item font-bold">{t('profile.MY_PROFILE')}</h1>
          <Button type="primary" ghost onClick={handleEdit}>
            {isEditable ? t('profile.DONE') : t('profile.EDIT')}
          </Button>
        </div>
        <div className={cls(['mt-2 rounded-xl px-4 sm:px-10 py-12 sm:flex justify-between', styles.mainInfo])}>
          <div className="flex">
            <div className="w-28 h-28 relative">
              {avatar ? (
                <img
                  className="absolute top-0 left-0 w-full object-cover h-full rounded-full"
                  src={URL.createObjectURL(avatar)}
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black bg-opacity-10"></div>
              )}
              <input
                type="file"
                name="avatar"
                className="w-full h-full opacity-0 cursor-pointer"
                onChange={handleAvatar}
                disabled={!isEditable}
              />
            </div>
            <div className={cls(['ml-4 sm:ml-8', styles.mainInfoWrap])}>
              <Input
                type="text"
                value={name}
                onChange={handleName}
                className="infoInput nameInput font-bold"
                disabled={!isEditable}
              />
              <Input
                type="text"
                value={phone}
                onChange={handlePhone}
                className="infoInput my-2"
                disabled={!isEditable}
              />
              <Input type="email" value={email} onChange={handleEmail} className="infoInput" disabled={!isEditable} />
            </div>
          </div>
          <div className="pt-8 sm:pt-2 mainAction">
            <div className="flex sm:justify-end relative mb-4">
              <div className="absolute top-0 left-0">
                <Button type="primary" ghost onClick={handleEdit}>
                  {id ? t('profile.UPLOADED_ID') : t('profile.UPLOAD_ID')}
                </Button>
              </div>
              <input type="file" name="id" className={cls(['opacity-0 cursor-pointer idFile'])} onChange={handleId} />
            </div>
            <div className="flex sm:justify-end">
              <Button type="primary" ghost onClick={handlePayment}>
                {t('profile.PAYMENT_METHOD')}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="text-24 text-item font-bold">{t('profile.ACTIVE_RENTALS')}</div>
          {visibleRental ? (
            <div className="flex flex-wrap mt-8 pr-2 h-96 overflow-y-auto">
              {hits.map((hit, key) => (
                <div className="w-1/2">
                  <HomePost hit={hit} key={key} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="pt-16 viewHomes">
                <Newhome className="mx-auto" />
                <div className="text-20 text-item font-semibold text-center w-60 mt-4">
                  {t('profile.RENT_YOU_NEW_HOME_TODAY')}
                </div>
                <div className="flex justify-center pt-10 pb-8">
                  <Button type="primary" onClick={viewHomes}>
                    {t('profile.VIEW_HOMES')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Profile;
