'use client';

import {
  BsPauseFill,
  BsPlayFill,
} from 'react-icons/bs';
import {
  AiFillStepBackward,
  AiFillStepForward,
} from 'react-icons/ai';
import {
  HiSpeakerWave,
  HiSpeakerXMark,
} from 'react-icons/hi2';
import { Song } from '@/types';
import MediaItem from './MediaItem';
import LikeButton from './LikeButton';
import Slider from './Slider';
import { useEffect, useState } from 'react';
import usePlayer from '@/hooks/usePlayer';
import useSound from 'use-sound';

interface PlayerContentProps {
  song: Song;
  songPath: string;
}

const PlayerContent: React.FC<
  PlayerContentProps
> = ({ song, songPath }) => {
  const [isPlaying, setIsPlaying] =
    useState(false);
  const [volume, setVolume] = useState(1);
  const player = usePlayer();

  const [play, { pause, sound }] = useSound(
    songPath,
    {
      volume: volume,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3'],
    }
  );

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  const Icon = isPlaying
    ? BsPauseFill
    : BsPlayFill;
  const VolumeIcon =
    volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentId = player.ids.findIndex(
      (id) => id === player.activeId
    );
    const nextSong = player.ids[currentId + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentId = player.ids.findIndex(
      (id) => id === player.activeId
    );
    const previousSong =
      player.ids[currentId - 1];

    if (!previousSong) {
      return player.setId(
        player.ids[player.ids.length - 1]
      );
    }

    player.setId(previousSong);
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon size={30} color="black" />
        </div>
      </div>
      <div className="md:flex hidden h-full items-center justify-center w-full max-w-[722px] gap-x-6">
        <AiFillStepBackward
          onClick={onPlayPrevious}
          size={30}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
        <div
          onClick={handlePlay}
          className="flex items-center justify-center rounded-full w-10 h-10 bg-white p-1 cursor-pointer"
        >
          <Icon size={30} color="black" />
        </div>
        <AiFillStepForward
          size={30}
          onClick={onPlayNext}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>
      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider
            value={volume}
            onChange={(value) => setVolume(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
