'use client';

import { twMerge } from 'tailwind-merge';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  RxCaretLeft,
  RxCaretRight,
} from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import Button from './Button';
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  children,
  className,
}) => {
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = useCallback(async () => {
    const { error } =
      await supabaseClient.auth.signOut();

    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out');
    }
  }, [router, supabaseClient.auth]);

  const { onOpen } = useAuthModal();

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
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button
                onClick={handleLogout}
                className="bg-white px-6 py-2 whitespace-nowrap"
              >
                Log out
              </Button>
              <Button
                onClick={() =>
                  router.push('/account')
                }
                className="bg-white"
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={onOpen}
                  className="bg-transparent text-neutral-300 font-medium"
                >
                  Sign Up
                </Button>
              </div>
              <div>
                <Button
                  onClick={onOpen}
                  className="bg-white px-6 py-2"
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
