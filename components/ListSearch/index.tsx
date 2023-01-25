import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import ListItem from '~/components/Screens/ListItem';
import { Hits } from 'react-instantsearch-dom';
import styles from './ListSearch.module.css';
import { cls } from '~/utils/functions';

const ListSearch: FC = () => {
  return (
    <Container className={cls(['lg:pr-4 px-4 sm:px-8 lg:pl-12 lg:mr-8 overflow-y-auto clear-both', styles.listSearch])}>
      <Hits hitComponent={ListItem} />
    </Container>
  );
};

export default ListSearch;
