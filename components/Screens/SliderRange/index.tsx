import React, { FC, useState, useEffect } from 'react';
import Container from '~/components/Screens/Container';
import { CurrentRefinement } from '~/components/Screens/IncDecInput';
import { ROUTES } from '~/utils/routes';
import { Slider } from 'antd';
import styles from './SliderRange.module.css';
import { cls } from '~/utils/functions';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setMonthlyRent } from '~/store/app/actions';
import { State } from '~/store/state';

interface SliderRangeProps {
  min: number;
  max: number;
  precision: number;
  refine: (value: CurrentRefinement) => void;
}

const SliderRange: FC<SliderRangeProps> = (props: SliderRangeProps) => {
  const { min, max, refine } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  const searchData = useSelector<State, State>(state => state);
  const [visibleSlider, setVisibleslider] = useState(false);

  useEffect(() => {
    const closePopup = () => {
      setVisibleslider(false);
    };

    document.body.addEventListener('click', closePopup);

    refine({
      min: 0,
      max: searchData.app.monthlyRent,
    });
  }, []);

  const onChange = (value: number) => {
    dispatch(setMonthlyRent(value));

    setTimeout(() => {
      refine({
        min: 0,
        max: value,
      });
    }, 500);
  };

  const formatBudget = (value: number) => {
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const handleSlider = () => {
    setVisibleslider(!visibleSlider);
  };

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  return (
    <Container className="w-full mt-1.5">
      {isHome() && (
        <div
          className="pl-2 sm:pl-0 py-1 sm:py-0 text-20 text-black font-bold cursor-pointer text-left sm:text-center font-blod"
          onClick={handleSlider}
        >
          {formatBudget(searchData.app.monthlyRent)}
        </div>
      )}
      {!visibleSlider && isHome() && (
        <div
          className={cls([
            styles.hideWrap,
            'hidden sm:block absolute sm:top-48 lg:top-20 w-full sm:w-150 px-6 py-2 sm:py-3 z-10 left-0',
          ])}
        ></div>
      )}
      <Container
        className={cls([
          'left-0 lg:left-1/2 -bottom-24 sm:top-48 lg:top-20 bg-white rounded-full flex font-medium text-black',
          visibleSlider || !isHome() ? 'w-full opacity-100 px-6' : 'sm:opacity-0',
          isHome() ? 'w-full lg:w-1/2 sm:absolute px-2 sm:px-6 py-1 sm:py-3 h-55 text-20' : 'p-0 h-35 text-16',
        ])}
      >
        <span className={cls(['mr-2 font-bold', isHome() ? '' : 'pt-1'])}>0</span>
        <Slider
          className="w-full"
          defaultValue={searchData.app.monthlyRent}
          step={100}
          disabled={false}
          min={min}
          max={max}
          onChange={onChange}
          // tooltipVisible={router.pathname !== ROUTES.HOME}
        />
        <span className={cls(['ml-2 smallLetterSpacing font-bold', isHome() ? '' : 'pt-1'])}>100,000</span>
      </Container>
    </Container>
  );
};

export default SliderRange;
