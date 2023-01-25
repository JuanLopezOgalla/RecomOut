import React from 'react';
import dynamic from 'next/dynamic';

const Live = () => {
  const ClientSideControls = dynamic(
    () => {
      return import('~/components/LiveStream');
    },
    { ssr: false }
  );

  return <ClientSideControls />;
};

export default Live;
