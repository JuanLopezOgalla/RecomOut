import React, { FC } from 'react';
import Container from '~/components/Screens/Container';
import { ROUTES } from '~/utils/routes';
import { useRouter } from 'next/router';
import { useTranslation, useLanguageQuery } from 'next-export-i18n';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText } from '~/store/app/actions';
import { State } from '~/store/state';
import { cls } from '~/utils/functions';
import styles from './QuickNav.module.css';

interface QuickNavProps {
  label: string;
}

const QuickNav: FC<QuickNavProps> = (props: QuickNavProps) => {
  const { label } = props;

  const router = useRouter();
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  const dispatch = useDispatch();

  const searchData = useSelector<State, State>(state => state);

  const mySearch = () => {
    dispatch(setSearchText(searchData.app.prevSearchText));
    router.push(`${ROUTES.LIST}?lang=${query.lang}`);
  };

  return (
    <Container className="flex justify-between">
      <div className={cls(['text-14 text-item font-medium underline', styles.topMenu])}>
        <span className="cursor-pointer" onClick={mySearch}>
          {t('item.MY_SEARCH')}
        </span>
        <i className="fa fa-angle-right text-20 mx-2"></i>
        <span className="font-bold">{searchData.app.searchText || label}</span>
      </div>
    </Container>
  );
};

export default QuickNav;
