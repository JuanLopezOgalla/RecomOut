import { useTranslation } from 'next-export-i18n';
import React from 'react';

export const CardView = ({
  isActive,
  bankType,
  cardNumber,
  amount,
  currency,
}: {
  isActive: boolean;
  bankType: string;
  cardNumber: string;
  amount: number;
  currency: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col w-full'>
      {isActive && <span>{t('payment.DEFAULT_CARD')}</span>}
      <div>
        <span>{bankType}</span>
        <div>{cardNumber}</div>
        <div>
          <span>{currency + amount}</span>
          <span>{t('payment.VISA')}</span>
        </div>
      </div>
    </div>
  );
};
