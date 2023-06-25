import { useSessionContext } from '@supabase/auth-helpers-react';

import { Song } from '@/types';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';

const useSongById = (id?: string) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const [song, setSong] = useState<
    Song | undefined
  >(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setIsLoading(false);
        toast.error(error.message);
      }

      setSong(data as Song);
      setIsLoading(false);
    };

    fetchData();
  }, [id, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song]
  );
};

export default useSongById;
