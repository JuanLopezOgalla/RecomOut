import React, { FC } from 'react';
import { cls } from '~/utils/functions';

export interface RoleType {
  label: string;
  value: string;
}

interface OptionButtonProps {
  item: RoleType;
  active: boolean;
  selectItem: (value: RoleType) => void;
}

const OptionButton: FC<OptionButtonProps> = (props: OptionButtonProps) => {
  const { item, active, selectItem } = props;

  const handleClick = () => {
    selectItem(item);
  };

  return (
    <button
      className={cls([
        'rounded-full text-14 font-semibold py-2.5 capitalize',
        active ? 'bg-black text-white' : 'bg-role',
      ])}
      onClick={handleClick}
    >
      {item.label}
    </button>
  );
};

export default OptionButton;
