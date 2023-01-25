import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import HomePost from '~/components/Screens/HomePost';
import { Hits, Configure, Menu } from 'react-instantsearch-dom';

interface RecentSearchProps {
  hitsPerPage: number;
}

const RecentSearch: FC<RecentSearchProps> = (props: RecentSearchProps) => {
  const { hitsPerPage } = props;

  return (
    <Container className="px-4 sm:px-12">
      <div className="hidden">
        <Menu attribute="isActive" defaultRefinement="true" />
      </div>
      <Configure hitsPerPage={hitsPerPage} />
      <Hits hitComponent={HomePost} />
    </Container>
  );
};

export default RecentSearch;
