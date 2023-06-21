'use client';

import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import {
  RxCaretLeft,
  RxCaretRight,
} from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import Button from './Button';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  children,
  className,
}) => {
  const router = useRouter();

  const handleLogout = useCallback(() => {}, []);

  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-emerald-900 p-6`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black hover:opacity-75 flex items-center justify-center transition"
          >
            <RxCaretLeft size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black hover:opacity-75 flex items-center justify-center transition"
          >
            <RxCaretRight size={35} />
          </button>
        </div>
        <div className="md:hidden flex gap-x-2 items-center">
          <button className="rounded-full bg-white p-2 hover:opacity-75 flex items-center justify-center transition">
            <HiHome
              size={20}
              className="text-black"
            />
          </button>
          <button className="rounded-full bg-white p-2 hover:opacity-75 flex items-center justify-center transition">
            <BiSearch
              size={20}
              className="text-black"
            />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          <>
            <div>
              <Button className="bg-transparent text-neutral-300 font-medium">
                Sign Up
              </Button>
            </div>
            <div>
              <Button className="bg-white px-6 py-2">
                Log in
              </Button>
            </div>
          </>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
