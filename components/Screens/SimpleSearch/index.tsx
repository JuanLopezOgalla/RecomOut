import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import { useTranslation } from 'next-export-i18n';

interface SimpleSearchProps {
  handleSearchBox: () => void;
}

const SimpleSearch: FC<SimpleSearchProps> = (props: SimpleSearchProps) => {
  const { handleSearchBox } = props;

  const { t } = useTranslation();

  const handleClick = () => {
    handleSearchBox();
  };

  return (
    <Container className="hidden absolute left-auto sm:left-0 right-20 sm:right-auto sm:flex sm:ml-48 lg:ml-64 2xl:ml-0 2xl:justify-center -z-1 w-2/3">
      <div
        className="flex justify-between w-simpleSearchMobile xl:w-simpleSearchmd my-1 border border-authBorder border-solid rounded-full p-2 cursor-pointer"
        onClick={handleClick}
      >
        <div className="hidden xl:block py-1.5 px-4 text-14 font-semibold">{t('home.SIMPLE_SEARCH')}</div>
        <i className="fa fa-search text-white bg-black rounded-full p-2.5"></i>
      </div>
    </Container>
  );
};

export default SimpleSearch;
