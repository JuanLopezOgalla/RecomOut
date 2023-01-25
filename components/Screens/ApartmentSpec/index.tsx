import React, { FC, ReactNode } from 'react';
import Container from '~/components/Screens/Container';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import styles from './ApartmentSpec.module.css';
import { cls } from '~/utils/functions';

interface ApartmentSpecProps {
  icon: ReactNode;
  title: string;
  min?: number;
  max?: number;
  value?: number;
  setValue?(value: number): void;
  type: string;
}

const ApartmentSpec: FC<ApartmentSpecProps> = (props: ApartmentSpecProps) => {
  const { icon, title, min, max, value, setValue, type } = props;

  const handleDecrement = () => {
    const decresedValue = value > min ? value - 1 : min;

    setValue(decresedValue);
  };

  const handleIncrement = () => {
    const incresedValue = value < max ? value + 1 : max;

    setValue(incresedValue);
  };

  const handleChange = (e: { target: { value: string } }) => {
    setValue(parseInt(e.target.value));
  };

  return (
    <Container className={cls(['flex justify-between', type === 'post' ? 'mb-8' : 'mr-4 sm:mr-8'])}>
      <div className="flex">
        {icon}
        <div className={cls(['text-black mt-1 ml-3', type === 'post' ? 'text-18 font-bold' : 'text-16 font-medium'])}>
          {title}
        </div>
        {type === 'item' && <div className="text-18 text-black font-bold mt-0.5 ml-3">{value}</div>}
      </div>
      {type === 'post' &&
        (title === 'SQFT' ? (
          <div className="">
            <Input className={styles.sqftInput} type="number" value={value} onChange={handleChange} />
          </div>
        ) : (
          <div className="flex">
            <button
              className="rounded-full border border-solid border-item w-8 h-8 -pt-1"
              type="button"
              onClick={handleDecrement}
            >
              <MinusOutlined className={cls(['font-bold', styles.controlBtn])} />
            </button>
            <Input
              className={cls(['border-0 text-center', styles.incdecInput])}
              type="number"
              value={value}
              min={min}
              max={max}
              disabled
            />
            <button
              className="rounded-full border border-solid border-item w-8 h-8 -pt-1"
              type="button"
              onClick={handleIncrement}
            >
              <PlusOutlined className={cls(['font-bold', styles.controlBtn])} style={{ strokeWidth: '30' }} />
            </button>
          </div>
        ))}
    </Container>
  );
};

export default ApartmentSpec;
