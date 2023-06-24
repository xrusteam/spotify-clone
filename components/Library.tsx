'use client';

import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { useCallback } from 'react';
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import useUploadModal from '@/hooks/useUploadModal';
import { Song } from '@/types';
import MediaItem from './MediaItem';

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({
  songs,
}) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();

  const { user } = useUser();

  const onClick = useCallback(() => {
    if (!user) {
      return authModal.onOpen();
    }

    // todo

    return uploadModal.onOpen();
  }, [authModal, uploadModal, user]);
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist
            size={26}
            className="text-neutral-400"
          />
          <p className="text-md text-neutral-400 font-medium">
            Your Library
          </p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={26}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((item) => (
          <MediaItem
            key={item.id}
            onClick={() => {}}
            data={item}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
