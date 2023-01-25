import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Form, Input, Button } from 'antd';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useMutation } from '@apollo/client';
import { cls } from '~/utils/functions';
import { ROUTES } from '~/utils/routes';
import styles from './Community.module.css';
import Container from '~/components/Screens/Container';
import { CREATE_COMMUNITY_MUTATION } from '~/utils/graphql';

const CommunityDetail = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const [newCommunityLink] = useMutation(CREATE_COMMUNITY_MUTATION, {
    update: () => {
      router.push(`${ROUTES.COMMUNITY}?lang=${query.lang}`);
    },
  });

  const onFinish = ({ name }: { name: string }) => {
    setLoading(true);
    newCommunityLink({ variables: { name } });
  };

  return (
    <Container className={cls(['bg-listBackground pb-12 propertyContainer', styles.formContainer])}>
      <NextSeo title="RECOM Add Community" description="Add community of RECOM." />
      <div className="w-full lg:flex h-full">
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center pt-28">
          <div className="flex justify-center items-center">
            <div className="w-full lg:w-sellProperty"></div>
          </div>
        </div>
        <div className="flex justify-center lg:w-1/2 px-4 mt-4 lg:mt-0 items-center pt-4 lg:pt-28">
          <div className="w-full lg:w-sellProperty">
            <div className="mt-8 flex justify-between">
              <h1 className="text-32 text-item font-bold">{t('community.NEW_COMMUNITY')}</h1>
            </div>
            <div className="mt-4">
              <Form
                name="community"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <div className="mt-4">
                  <Form.Item label="" name="name" rules={[{ required: true, message: t('community.REQUIRED_NAME') }]}>
                    <Input type="text" size="large" placeholder={t('community.NAME')} />
                  </Form.Item>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t('listing.SAVE')}
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

export default CommunityDetail;
