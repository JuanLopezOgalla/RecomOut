import React, { FC, Fragment } from 'react';
import { useRouter } from 'next/router';
import { cls } from '~/utils/functions';
import Mark1 from '~/public/icons/mark1.svg';
import Mark2 from '~/public/icons/mark2.svg';
import Mark3 from '~/public/icons/mark3.svg';
import Mark4 from '~/public/icons/mark4.svg';
import { ROUTES } from '~/utils/routes';

const AmenityItem: FC<{ amenity: string }> = (props: { amenity: string }) => {
  const { amenity } = props;
  const router = useRouter();

  const isItem = () => {
    return router.pathname === ROUTES.ITEM || router.pathname === ROUTES.LISTING_ADD;
  };

  return (
    <Fragment>
      {amenity === 'Central Air-Conditioning' ? (
        <Mark1 className={cls(['text-auth', isItem() ? 'w-8 h-8' : 'w-5 h-5'])} />
      ) : amenity === 'Parking Spaces' ? (
        <Mark2 className={cls(['text-auth', isItem() ? 'w-8 h-8' : 'w-5 h-5'])} />
      ) : amenity === 'Central Heating' ? (
        <Mark3 className={cls(['text-auth', isItem() ? 'w-8 h-8' : 'w-5 h-5'])} />
      ) : amenity === 'Ready to move in' ? (
        <Mark4 className={cls(['text-auth', isItem() ? 'w-8 h-8' : 'w-5 h-5'])} />
      ) : (
        <></>
      )}
    </Fragment>
  );
};

export default AmenityItem;
