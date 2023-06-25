'use client';

import useLoadImage from '@/hooks/useLoadImage';
import { Song } from '@/types';
import Image from 'next/image';
import { useCallback } from 'react';

interface MediaItemProps {
  onClick?: (id: string) => void;
  data: Song;
}

const MediaItem: React.FC<MediaItemProps> = ({
  onClick,
  data,
}) => {
  const imagePath = useLoadImage(data);

  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick(data.id);
    }
  }, [data, onClick]);

  return (
    <div
      onClick={handleClick}
      className="flex items-center p-2 gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full rounded-md"
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image
          src={imagePath || '/images/liked.png'}
          alt="Media Image"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">
          {data.title}
        </p>
        <p className="text-neutral-400 text-sm truncate">
          {data.author}
        </p>
      </div>
    </div>
  );
};

export default MediaItem;
