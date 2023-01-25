import React, { FC, useEffect } from 'react';
import Container from '~/components/Screens/Container';
import { ROUTES } from '~/utils/routes';
import Bed from '~/public/icons/bed.svg';
import { Input } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styles from './IncDecInput.module.css';
import { cls } from '~/utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { setBedRooms } from '~/store/app/actions';
import { State } from '~/store/state';
import { useRouter } from 'next/router';

export interface CurrentRefinement {
  min: number;
  max: number;
}

interface IncDecInputProps {
  label: string;
  currentRefinement: CurrentRefinement;
  min: number;
  max: number;
  precision: number;
  refine: (value: CurrentRefinement) => void;
}

const IncDecInput: FC<IncDecInputProps> = (props: IncDecInputProps) => {
  const { label, currentRefinement, min, max, precision, refine } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const searchData = useSelector<State, State>(state => state);

  useEffect(() => {
    refine({
      ...currentRefinement,
      min: searchData.app.bedRooms,
      max: searchData.app.bedRooms ? searchData.app.bedRooms : 10,
    });
  }, []);

  const handleDecrement = () => {
    const decresedValue = searchData.app.bedRooms > min ? searchData.app.bedRooms - 1 : min;

    dispatch(setBedRooms(decresedValue));

    refine({
      ...currentRefinement,
      min: decresedValue,
      max: decresedValue,
    });
  };

  const handleIncrement = () => {
    const incresedValue = searchData.app.bedRooms < max ? searchData.app.bedRooms + 1 : max;

    dispatch(setBedRooms(incresedValue));

    refine({
      ...currentRefinement,
      min: incresedValue,
      max: incresedValue,
    });
  };

  const onChange = (e: { target: { value: string } }) => {
    dispatch(setBedRooms(parseInt(e.target.value)));

    refine({
      ...currentRefinement,
      min: parseInt(e.target.value),
      max: parseInt(e.target.value),
    });
  };

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  return (
    <Container className={cls(['flex items-center', isHome() ? 'justify-center' : ''])}>
      <button
        className={cls([styles.btn, isHome() ? styles.homeBtn : styles.listBtn])}
        type="button"
        onClick={handleDecrement}
      >
        <MinusOutlined />
      </button>
      {!isHome() && <Bed className="text-listIcon w-5 h-5 -mr-1 ml-4" />}
      <Input
        className={cls(['qnt-input border-0 text-center', isHome() ? 'homeInput' : ''])}
        type="number"
        onChange={onChange}
        value={searchData.app.bedRooms}
        min={min}
        max={max}
        step={1 / Math.pow(10, precision)}
        disabled
      />
      <span className="text-20">{label}</span>
      <button
        className={cls([styles.btn, isHome() ? styles.homeBtn : styles.listBtn])}
        type="button"
        onClick={handleIncrement}
      >
        <PlusOutlined className="font-bold" style={{ strokeWidth: '30' }} />
      </button>
    </Container>
  );
};

export default IncDecInput;
