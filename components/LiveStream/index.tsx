import React, { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useAgora from '~/components/UseAgora';
import MediaPlayer from '~/components/MediaPlayer';
import { Form, Input, Button } from 'antd';
import { useTranslation } from 'next-export-i18n';

export type Room = {
  channel: string;
  token: string;
};

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

const LiveStream = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [channel, setChannel] = useState('');
  const { localVideoTrack, leave, join, joinState, remoteUsers, errorStatus } = useAgora(client);

  const onFinish = (values: Room) => {
    console.log(values);
  };

  const handleChannel = (e: { target: { value: string } }) => {
    setChannel(e.target.value);
  };

  const handleToken = (e: { target: { value: string } }) => {
    setToken(e.target.value);
  };

  const handleJoin = () => {
    if (channel !== '' && token !== '') join(channel, token);
  };

  return (
    <div className="call pt-32 px-12">
      <Form name="properties" labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} onFinish={onFinish} autoComplete="off">
        <div className="mt-4 flex">
          <Form.Item label="Channel: " name="channel">
            <Input type="text" size="large" onChange={handleChannel} />
          </Form.Item>
          <Form.Item label="Token: " name="token">
            <Input type="text" size="large" onChange={handleToken} />
          </Form.Item>
          <Button className="rounded-lg ml-12 mt-1" type="primary" id="join" disabled={joinState} onClick={handleJoin}>
            {t('livestream.JOIN')}
          </Button>
          <Button
            className="ml-4 mt-1 rounded-lg"
            type="primary"
            id="Leave"
            disabled={!joinState}
            onClick={() => {
              leave();
            }}
          >
            {t('livestream.LEAVE')}
          </Button>
        </div>
      </Form>
      {errorStatus && <div className="text-danger text-14 pl-8">{errorStatus}</div>}
      <div className="player-container mt-4">
        <div className="local-player-wrapper mt-4">
          <p className="local-player-text">{localVideoTrack && t('livestream.MY_TRACK')}</p>
          <MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>
        </div>
        <div className="flex flex-wrap my-8">
          {remoteUsers.map(user => (
            <div className="remote-player-wrapper mr-4" key={user.uid}>
              <p className="remote-player-text">{t('livestream.REMOTE_TRACK')}</p>
              <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
