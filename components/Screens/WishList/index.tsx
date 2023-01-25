import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import { cls } from '~/utils/functions';
import Wishlist from '~/public/icons/wishlist.svg';

interface WishListProps {
  darkHeader: boolean;
}

const WishList: FC<WishListProps> = (props: WishListProps) => {
  const { darkHeader } = props;

  return (
    <Container className="sm:ml-4 cursor-pointer text-searchBox">
      <Wishlist className={cls(['w-6 sm:w-8', darkHeader ? 'sm:text-white' : 'sm:text-black'])} />
    </Container>
  );
};

export default WishList;
