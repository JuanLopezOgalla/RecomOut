import React, { FC, useEffect } from 'react';
import Container from '~/components/Screens/Container';
import { Select } from 'antd';
import phonecodes, { getIndexOfCountry } from '~/utils/phonecodes';
import { cls } from '~/utils/functions';
import { defaultCountry } from '~/utils/constants';

interface PhoneNumberProps {
  code: string;
  number: string;
  type: string;
  changeCode(value: string): void;
  changeNumber(value: string): void;
}

const PhoneNumber: FC<PhoneNumberProps> = (props: PhoneNumberProps) => {
  const { number, type, changeCode, changeNumber } = props;

  const { Option } = Select;

  useEffect(() => {
    handleCode(`(${phonecodes[getIndexOfCountry(defaultCountry)].dial_code})`);
  }, []);

  const handleCode = (value: string) => {
    const phoneCode = value.split('-');

    changeCode(phoneCode[0]);
  };

  const handleNumber = (e: { target: { value: string } }) => {
    if (!Number(e.target.value)) {
      return;
    }

    changeNumber(e.target.value);
  };

  return (
    <Container
      className={cls([
        'flex phonenumberWrap border border-solid border-black border-opacity-10 bg-white',
        type === 'auth' ? 'authPhoneNumber rounded-full' : 'propertyPhoneNumber rounded-lg',
      ])}
    >
      <div className="w-full">
        <Select
          showSearch
          onChange={handleCode}
          defaultValue={`(${phonecodes[getIndexOfCountry(defaultCountry)].dial_code})`}
        >
          {phonecodes &&
            phonecodes.map((phonecode, key) => (
              <Option value={`${phonecode.dial_code}-${phonecode.name}`} key={key}>
                <img
                  src={`https://flagcdn.com/16x12/${phonecode.code.toLowerCase()}.png`}
                  className="w-4 h-3 mr-2 mt-1"
                />
                <span className="mr-1 phoneCountry">{phonecode.name}</span>
                <span>({phonecode.dial_code})</span>
              </Option>
            ))}
        </Select>
      </div>
      <div className={cls(['w-full z-10', type === 'auth' ? '-ml-40 sm:-ml-56' : '-ml-60 sm:-ml-72'])}>
        <input type="text" value={number} onChange={handleNumber} className="w-full h-full pl-2 pt-1 tracking-widest" />
      </div>
    </Container>
  );
};

export default PhoneNumber;
