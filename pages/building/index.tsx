import React, { useEffect, useState } from 'react';
import Container from '~/components/Screens/Container';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useQuery } from '@apollo/client';
import { Table, Input, Space, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { ROUTES } from '~/utils/routes';
import { useRouter } from 'next/router';
import { firebase } from '~/utils/firebase';
import Link from 'next/link';
import { Building } from '../listing/add';
import { BUILDINGS_QUERY } from '~/utils/graphql';
import { useDispatch } from 'react-redux';
import { setFbToken } from '~/store/app/actions';
import { NextSeo } from 'next-seo';

const BuildingList = () => {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  const buildingsData = useQuery(BUILDINGS_QUERY);

  const [buildings, setBuildings] = useState<Array<Building>>([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  useEffect(() => {
    if (buildingsData.data) {
      let buildingsNew = [];

      buildingsData.data.getBuildings.data.map(building => {
        const listingItem = {
          id: building.id,
          name: building.name,
          country: building.country,
          city: building.city,
          state: building.state,
          district: building.district,
          zip: building.zip,
          address: building.address,
          buildingNumber: building.buildingNumber,
        };

        buildingsNew.push(listingItem);
      });

      setBuildings(buildingsNew);
    }
  }, [buildingsData.data]);

  useEffect(() => {
    if (buildingsData.error && buildingsData.error.message.includes('Firebase ID token has expired')) {
      getNewToken();
    }
  }, [buildingsData.error]);

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
      title: t('building.NAME'),
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: t('building.COUNTRY'),
      dataIndex: 'country',
      key: 'country',
      ...getColumnSearchProps('country'),
    },
    {
      title: t('building.CITY'),
      dataIndex: 'city',
      key: 'city',
      ...getColumnSearchProps('city'),
    },
    {
      title: t('building.STATE'),
      dataIndex: 'state',
      key: 'state',
      ...getColumnSearchProps('state'),
    },
    {
      title: t('building.DISTRICT'),
      dataIndex: 'district',
      key: 'district',
      ...getColumnSearchProps('district'),
    },
    {
      title: t('building.ZIP'),
      dataIndex: 'zip',
      key: 'zip',
      ...getColumnSearchProps('zip'),
    },
    {
      title: t('building.ADDRESS'),
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address'),
    },
    {
      title: t('building.BUILDING_NUMBER'),
      dataIndex: 'buildingNumber',
      key: 'buildingNumber',
      ...getColumnSearchProps('buildingNumber'),
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="middle">
          <Link href={{ pathname: `${ROUTES.BUILDING_DETAIL}${record.id}`, query }}>
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

  const newBuilding = () => {
    router.push(`${ROUTES.BUILDING_ADD}?lang=${query.lang}`);
  };

  return (
    <Container className="mainContainer ListingOverview pt-24 px-8">
      <NextSeo title="RECOM Building List" description="Building list of RECOM." />
      <div className="mt-2 mb-4 flex justify-end">
        <Button type="primary" onClick={newListing} className="mr-4 text-neutral-400">
          {t('post.NEW_LISTING')}
        </Button>
        <Button type="primary" onClick={newBuilding}>
          {t('building.NEW_BUILDING')}
        </Button>
      </div>
      <Table columns={columns} dataSource={buildings} pagination={{ pageSize: 9 }} />
    </Container>
  );
};

export default BuildingList;
