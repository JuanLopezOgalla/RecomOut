import React, { useEffect, useState } from 'react';
import Container from '~/components/Screens/Container';
import { GET_LISTINGS_QUERY } from '~/utils/graphql';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useQuery } from '@apollo/client';
import { Table, Input, Space, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { ROUTES } from '~/utils/routes';
import { useRouter } from 'next/router';
import { firebase } from '~/utils/firebase';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setFbToken } from '~/store/app/actions';
import { NextSeo } from 'next-seo';

export type Listing = {
  key: string;
  community: string;
  building: string;
  property: string;
  listingType: string;
  amount: number;
  amountCurrency: string;
  amountType: string;
  isActive: boolean;
};

const Listing = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  const listingsData = useQuery(GET_LISTINGS_QUERY);

  const [listings, setListings] = useState<Array<Listing>>([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  useEffect(() => {
    if (listingsData.data) {
      let listingsNew = [];

      listingsData.data.getListings.data.map(listing => {
        const listingItem = {
          key: listing.id.toString(),
          id: listing.id,
          community: listing.property.community.name,
          building: listing.property.building.name,
          propertyType: listing.property.propertyType,
          beds: listing.property.beds,
          baths: listing.property.baths,
          sqft: listing.property.sqft,
          unitNumber: listing.property.unitNumber,
          listingType: listing.listingType,
          amount: listing.amount,
          amountCurrency: listing.amountCurrency,
          amountType: listing.amountType,
        };

        listingsNew.push(listingItem);
      });

      setListings(listingsNew);
    }
  }, [listingsData.data]);

  useEffect(() => {
    if (listingsData.error && listingsData.error.message.includes('Firebase ID token has expired')) {
      getNewToken();
    }
  }, [listingsData.error]);

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

  const handleSearch = (selectedKeys: string, confirm: () => void, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          // ref={node => {
          //   searchInput = node;
          // }}
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
      title: t('listing.UNIT_NUMBER'),
      dataIndex: 'unitNumber',
      key: 'unitNumber',
      ...getColumnSearchProps('unitNumber'),
    },
    {
      title: t('post.PROPERTYTYPE'),
      dataIndex: 'propertyType',
      key: 'propertyType',
      ...getColumnSearchProps('propertyType'),
    },
    {
      title: t('list.BEDROOMS'),
      dataIndex: 'beds',
      key: 'beds',
      ...getColumnSearchProps('beds'),
    },
    {
      title: t('item.BATHROOMS'),
      dataIndex: 'baths',
      key: 'baths',
      ...getColumnSearchProps('baths'),
    },
    {
      title: t('post.SQFT'),
      dataIndex: 'sqft',
      key: 'sqft',
      ...getColumnSearchProps('sqft'),
    },
    {
      title: t('post.LISTING_TYPE'),
      dataIndex: 'listingType',
      key: 'listingType',
      ...getColumnSearchProps('listingType'),
    },
    {
      title: t('listing.AMOUNT'),
      dataIndex: 'amount',
      key: 'amount',
      ...getColumnSearchProps('amount'),
    },
    {
      title: t('post.AMOUNT_CURRENCY'),
      dataIndex: 'amountCurrency',
      key: 'amountCurrency',
      ...getColumnSearchProps('amountCurrency'),
    },
    {
      title: t('post.AMOUNT_TYPE'),
      dataIndex: 'amountType',
      key: 'amountType',
      ...getColumnSearchProps('amountType'),
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="middle">
          <Link href={{ pathname: `${ROUTES.LISTING_DETAIL}${record.id}`, query }}>
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

  return (
    <Container className="mainContainer ListingOverview pt-24 px-8">
      <NextSeo title="RECOM Listing List" description="RECOM Listing List." />
      <div className="mt-2 mb-4 flex justify-end">
        <Button type="primary" onClick={newListing}>
          {t('post.NEW_LISTING')}
        </Button>
      </div>
      <Table columns={columns} dataSource={listings} pagination={{ pageSize: 9 }} />
    </Container>
  );
};

export default Listing;
