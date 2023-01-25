import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '~/components/Screens/Container';
import { GET_COMMUNITY_QUERY, UPDATE_COMMUNITY_MUTATION } from '~/utils/graphql';
import { Form, Input, Button } from 'antd';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useQuery, useMutation } from '@apollo/client';
import { ROUTES } from '~/utils/routes';
import { NextSeo } from 'next-seo';
import { cls } from '~/utils/functions';
import styles from './Community.module.css';

export type Community = {
  id: number;
  name: string;
};

const CommunityDetail = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const [community, setCommunity] = useState<Community>();
  const [isLoading, setLoading] = useState(false);

  const result =
    router.query.id &&
    useQuery(GET_COMMUNITY_QUERY, {
      variables: { id: parseInt(router.query.id.toString()) },
    });

  const [updateCommunityLink] = useMutation(UPDATE_COMMUNITY_MUTATION, {
    update: () => {
      router.push(`${ROUTES.COMMUNITY}?lang=${query.lang}`);
    },
  });

  useEffect(() => {
    if (result?.data) {
      setCommunity(result.data.getCommunity);
    }
  }, [result?.data]);

  const onFinish = (values: Community) => {
    setLoading(true);
    updateCommunityLink({ variables: { id: parseInt(router.query.id.toString()), ...values } });
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
              <h1 className="text-32 text-item font-bold">{t('community.EDIT_COMMUNITY')}</h1>
            </div>
            <div className="mt-4">
              {community && (
                <Form
                  name="community"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  onFinish={onFinish}
                  autoComplete="off"
                  initialValues={{ name: community.name }}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CommunityDetail;
