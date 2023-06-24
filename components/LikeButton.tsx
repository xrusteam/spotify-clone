'use client';

import toast from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  AiFillHeart,
  AiOutlineHeart,
} from 'react-icons/ai';
import useAuthModal from '@/hooks/useAuthModal';

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  songId,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const authModal = useAuthModal();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked
    ? AiFillHeart
    : AiOutlineHeart;

  const handleClick = useCallback(async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
        toast.success('Unlike');
      }
    } else {
      const { error } = await supabaseClient
        .from('liked_songs')
        .insert({
          song_id: songId,
          user_id: user.id,
        });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success('Liked');
      }
    }

    router.refresh();
  }, [
    authModal,
    isLiked,
    songId,
    supabaseClient,
    user,
    router,
  ]);
  return (
    <button
      onClick={handleClick}
      className="hover:opacity-75 transition"
    >
      <Icon
        size={25}
        color={isLiked ? '#22c55e' : 'white'}
      />
    </button>
  );
};

export default LikeButton;
