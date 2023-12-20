import { Capacitor } from '@capacitor/core';
import { CapacitorVideoPlayer } from 'capacitor-video-player';


export const setVideoPlayer = async (): Promise<any>=> {
  const platform = Capacitor.getPlatform();
  return {plugin:CapacitorVideoPlayer, platform};
};
