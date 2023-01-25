import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { cls } from '~/utils/functions';
import Container from '~/components/Screens/Container';
import Message from '~/public/icons/message.svg';
import Audio from '~/public/icons/audio.svg';
import Video from '~/public/icons/video.svg';
import { ROUTES } from '~/utils/routes';

const ChatBox: FC = () => {
  const router = useRouter();

  const isItem = () => {
    return router.pathname === ROUTES.ITEM;
  };

  return (
    <Container className="flex">
      <Message className={cls(['cursor-pointer', isItem() ? 'ml-4' : 'ml-2'])} />
      <Audio className={cls(['cursor-pointer', isItem() ? 'ml-4' : 'ml-2'])} />
      <Video className={cls(['cursor-pointer', isItem() ? 'ml-4' : 'ml-2'])} />
    </Container>
  );
};

export default ChatBox;
