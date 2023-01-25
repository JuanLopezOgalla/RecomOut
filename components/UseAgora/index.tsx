import { useState, useEffect } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  MicrophoneAudioTrackInitConfig,
  CameraVideoTrackInitConfig,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  ILocalVideoTrack,
  ILocalAudioTrack,
} from 'agora-rtc-sdk-ng';

export default function useAgora(client: IAgoraRTCClient | undefined): {
  localAudioTrack: ILocalAudioTrack | undefined;
  localVideoTrack: ILocalVideoTrack | undefined;
  joinState: boolean;
  leave: Function;
  join: Function;
  remoteUsers: IAgoraRTCRemoteUser[];
  errorStatus: string;
} {
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  const [errorStatus, setErrorStatus] = useState('');

  let token = '';

  async function createLocalTracks(
    audioConfig?: MicrophoneAudioTrackInitConfig,
    videoConfig?: CameraVideoTrackInitConfig
  ): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);

    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  const join = async (channelInputed: string, tokenInputed?: string) => {
    try {
      setErrorStatus('');

      token = tokenInputed;

      if (!client) return;

      const [microphoneTrack, cameraTrack] = await createLocalTracks();

      await client.join(process.env.NEXT_PUBLIC_AGORA_APPID, channelInputed, tokenInputed);
      await client.publish([microphoneTrack, cameraTrack]);

      (window as any).client = client;
      (window as any).videoTrack = cameraTrack;

      setJoinState(true);
    } catch (e) {
      if (e.message.includes('DEVICE_NOT_FOUND')) setErrorStatus('Please check video or audio device.');
      else if (e.message.includes('dynamic key expired')) setErrorStatus('Token Expired, please use new token.');
      else if (e.message.includes('invalid')) setErrorStatus('Please check channel and token again!');
    }
  };

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }

    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }

    setRemoteUsers([]);
    setJoinState(false);
    await client?.leave();
  }

  useEffect(() => {
    if (!client) return;

    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers(Array.from(client.remoteUsers));
    };
    const handleUserUnpublished = () => {
      setRemoteUsers(Array.from(client.remoteUsers));
    };
    const handleUserJoined = () => {
      setRemoteUsers(Array.from(client.remoteUsers));
    };
    const handleUserLeft = () => {
      setRemoteUsers(Array.from(client.remoteUsers));
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client.on('token-privilege-did-expire', async () => {
      await client.renewToken(token);
    });

    client.on('token-privilege-will-expire', async function () {
      await client.renewToken(token);
    });

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    errorStatus,
  };
}
