'use client';

import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

import Modal from './Modal';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import useAuthModal from '@/hooks/useAuthModal';
import { useEffect } from 'react';

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();

  const router = useRouter();

  const { isOpen, onClose } = useAuthModal();

  const onChange = (open: boolean) => {
    if (!open) onClose();
  };

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [onClose, router, session]);
  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        supabaseClient={supabaseClient}
        theme="dark"
        magicLink
        providers={['github']}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#22c55e',
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
