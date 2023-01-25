import React, { useState } from 'react';
import Container from '~/components/Screens/Container';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { Table, Input, Space, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { ROUTES } from '~/utils/routes';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import useCommunities from './hooks/useCommunities';

export type Community = {
  id: number;
  name: string;
  createdBy: {
    name: string;
  };
  isActive: boolean;
};

const CommunityList = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const communities = useCommunities();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        // setTimeout(() => searchInput.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: t('community.NAME'),
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: t('community.CREATEDBY'),
      dataIndex: 'createdby',
      key: 'createdby',
      ...getColumnSearchProps('createdby'),
    },
    {
      title: t('community.STATUS'),
      dataIndex: 'isActive',
      key: 'isActive',
      ...getColumnSearchProps('isActive'),
      render: (value: boolean) => <span>{value ? 'Active' : 'Inactive'}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="middle">
          <Link href={{ pathname: `${ROUTES.COMMUNITY_DETAIL}${record.id}`, query }}>
            <a>{t('profile.EDIT')}</a>
          </Link>
          <a>{t('post.DELETE')}</a>
        </Space>
      ),
    },
  ];

  const newListing = () => {
    router.push(`${ROUTES.LISTING_ADD}?lang=${query.lang}`);
  };

  const newCommunity = () => {
    router.push(`${ROUTES.COMMUNITY_ADD}?lang=${query.lang}`);
  };

  return (
    <Container className="mainContainer ListingOverview pt-24 px-8">
      <NextSeo title="RECOM Community List" description="Community list of RECOM." />
      <div className="mt-2 mb-4 flex justify-end">
        <Button type="primary" onClick={newCommunity} className="mr-4">
          {t('community.NEW_COMMUNITY')}
        </Button>
        <Button type="primary" onClick={newListing}>
          {t('post.NEW_LISTING')}
        </Button>
      </div>
      <Table columns={columns} dataSource={communities} pagination={{ pageSize: 9 }} />
    </Container>
  );
};

export default CommunityList;
