'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import Box from './Box';
import SidebarItem from './SidebarItem';
import Library from './Library';
import { Song } from '@/types';
import usePlayer from '@/hooks/usePlayer';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  songs,
}) => {
  const pathname = usePathname();
  const player = usePlayer();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        href: '/',
        active: pathname !== '/search',
        label: 'Home',
      },
      {
        label: 'Search',
        icon: BiSearch,
        active: pathname === '/search',
        href: '/search',
      },
    ],
    [pathname]
  );
  return (
    <div
      className={twMerge(
        `h-full flex`,
        player.activeId && 'h-[calc(100%-80px)]'
      )}
    >
      <div className="hidden lg:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
              />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} />
        </Box>
      </div>
      <main className="flex-1 h-full py-2 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
