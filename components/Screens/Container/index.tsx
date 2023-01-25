import React, { FC, ReactNode } from 'react';

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = (props: ContainerProps) => {
  const { children, className } = props;

  return <div className={className}>{children}</div>;
};

export default Container;
