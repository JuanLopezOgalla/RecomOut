import React from 'react';
import { cls } from '~/utils/functions';
import { Button } from 'antd';
import { useLanguageQuery, useTranslation } from 'next-export-i18n';
import { useRouter } from 'next/router';
import { ROUTES } from '~/utils/routes';

const StepEnd = ({ isActive, initListing }: { isActive: boolean; initListing: () => void }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [query] = useLanguageQuery();

  const viewListing = () => {
    router.push(`${ROUTES.LISTING}?lang=${query.lang}`);
  };

  return (
    <div
      className={cls([
        'flex justify-end items-end w-full border-t border-solid border-black border-opacity-10',
        isActive ? 'block' : 'hidden',
      ])}
    >
      <div className="flex flex-row w-full justify-between pl-20 pr-20 pb-10">
        <Button type="primary" onClick={viewListing}>
          {t('post.VIEW_LISTING')}
        </Button>
        <Button type="primary" onClick={initListing}>
          <i className="fa fa-plus mr-2"></i> {t('post.LIST_ANOTHER')}
        </Button>
      </div>
    </div>
  );
};

export default StepEnd;
