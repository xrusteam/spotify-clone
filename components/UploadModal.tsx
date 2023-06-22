'use client';

import uniqid from 'uniqid';
import {
  useForm,
  FieldValues,
  SubmitHandler,
} from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useUploadModal from '@/hooks/useUploadModal';
import Modal from './Modal';
import { useCallback, useState } from 'react';
import Input from './Input';
import Button from './Button';
import { useUser } from '@/hooks/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

const UploadModal = () => {
  const [isLoading, setIsLoading] =
    useState(false);
  const router = useRouter();
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();

  const { register, handleSubmit, reset } =
    useForm<FieldValues>({
      defaultValues: {
        author: '',
        title: '',
        song: null,
        image: null,
      },
    });

  const onSubmit: SubmitHandler<
    FieldValues
  > = async (data) => {
    try {
      setIsLoading(true);

      const imageFile = data.image?.[0];
      const songFile = data.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }

      const uniqueId = uniqid();

      const { data: songData, error: songError } =
        await supabaseClient.storage
          .from('songs')
          .upload(
            `song-${data.title}-${uniqueId}`,
            songFile,
            {
              cacheControl: '3600',
              upsert: false,
            }
          );

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed song upload');
      }

      const {
        data: imageData,
        error: imageError,
      } = await supabaseClient.storage
        .from('images')
        .upload(
          `image-${data.title}-${uniqueId}`,
          imageFile,
          {
            cacheControl: '3600',
            upsert: false,
          }
        );

      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      const { error: supabaseError } =
        await supabaseClient
          .from('songs')
          .insert({
            user_id: user.id,
            title: data.title,
            author: data.author,
            image_path: imageData.path,
            song_path: songData.path,
          });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      toast.success('Song created');
      setIsLoading(false);
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = useCallback(
    (open: boolean) => {
      if (!open) {
        reset();
        uploadModal.onClose();
      }
    },
    [reset, uploadModal]
  );

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', {
            required: true,
          })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', {
            required: true,
          })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input
            id="song"
            type="file"
            accept=".mp3"
            disabled={isLoading}
            {...register('song', {
              required: true,
            })}
          />
        </div>
        <div>
          <div className="pb-1">
            Select an image file
          </div>
          <Input
            id="image"
            type="file"
            accept="image/*"
            disabled={isLoading}
            {...register('image', {
              required: true,
            })}
          />
        </div>
        <Button
          disabled={isLoading}
          type="submit"
        >
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
