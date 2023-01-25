import React, { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation } from 'swiper';

SwiperCore.use([Autoplay]);
SwiperCore.use([Navigation]);

export type FileUpload = {
  id: number;
  file?: File;
  loading: boolean;
};

interface MainSliderProps {
  mainSliders: string[] | FileUpload[];
  navigation: boolean;
  type?: string;
}

const MainSlider: FC<MainSliderProps> = (props: MainSliderProps) => {
  const { mainSliders, navigation, type } = props;

  const breakpoints = {
    1440: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    1200: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    576: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
  };

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      // autoplay={{ delay: 3000 }}
      navigation={navigation}
      speed={1000}
      effect={'slide'}
      breakpoints={breakpoints}
    >
      {mainSliders &&
        mainSliders.map((el, key) => {
          if (el)
            return (
              <SwiperSlide key={key}>
                {type === 'file'
                  ? el.file && (
                      <img
                        src={URL.createObjectURL(el.file)}
                        className="mx-auto my-0 rounded-lg w-full h-full object-cover"
                      />
                    )
                  : el && (
                      <img src={el} className="mx-auto my-0 rounded-lg w-full h-full object-cover cursor-pointer" />
                    )}
              </SwiperSlide>
            );
        })}
    </Swiper>
  );
};

export default MainSlider;
