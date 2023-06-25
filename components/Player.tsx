'use client';

import useSongById from '@/hooks/useGetSongById';
import useLoadSong from '@/hooks/useLoadSongUrl';
import usePLayer from '@/hooks/usePlayer';
import PlayerContent from './PlayerContent';

const Player = () => {
  const player = usePLayer();
  const { song } = useSongById(player.activeId);

  const songPath = useLoadSong(song!);

  if (!song || !songPath || !player.activeId) {
    return null;
  }

  return (
    <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
      <PlayerContent
        key={songPath}
        song={song}
        songPath={songPath}
      />
    </div>
  );
};

export default Player;
