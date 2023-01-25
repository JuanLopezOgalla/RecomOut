import React from 'react';
import styles from './404.module.css';
import router from 'next/router';

const Index = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainImg}>
        <img src="/images/404_page.png" alt="" />
      </div>
      <div className={styles.description}>
        <h5>{'404'}</h5>
        <button onClick={() => router.back()}>{'STEP_BACK'}</button>
      </div>
    </div>
  );
};

export default Index;
