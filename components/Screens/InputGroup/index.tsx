import React, { FC } from 'react';
import { cls } from '~/utils/functions';
import Container from '~/components/Screens/Container';

interface InputGroupProps {
  className: string;
  label: string;
  input: React.ReactElement;
}

const InputGroup: FC<InputGroupProps> = (props: InputGroupProps) => {
  const { className, label, input } = props;

  return (
    <Container className={cls(['flex mr-4', className])}>
      <div className="mt-1 mr-2">{label} : </div>
      {input}
    </Container>
  );
};

export default InputGroup;
