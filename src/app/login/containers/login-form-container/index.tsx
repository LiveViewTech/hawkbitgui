'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppRoutes } from '@/utils/routes';
import LoginForm from '@/app/login/components/login-form';
import toast from 'react-hot-toast';
import { handleErrorWithToast } from '@/utils/handle-error-with-toast';
import { useEffect } from 'react';

export type LoginFormContainerProps = {
  className?: string;
};

// Only same-site paths: an absolute or protocol-relative callbackUrl would be an open redirect.
const getRedirectAfterLogin = (callbackUrl: string | null) => {
  if (
    !callbackUrl ||
    !callbackUrl.startsWith('/') ||
    callbackUrl.startsWith('//') ||
    callbackUrl.startsWith('/\\') ||
    callbackUrl.startsWith(AppRoutes.login)
  ) {
    return AppRoutes.deployment;
  }
  return callbackUrl;
};

export default function LoginFormContainer({ className }: LoginFormContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'unauthorized':
          // Fixed id: the message is shown once even if the effect runs again.
          toast.error('Your session has expired. Please log in again.', { id: 'session-expired' });
          break;
        default:
          toast.error('An error occurred. Please try again.');
      }

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error && result.error === 'CredentialsSignin') {
        toast.error('Invalid username or password');
        return;
      }

      router.push(getRedirectAfterLogin(searchParams.get('callbackUrl')));
      router.refresh();
    } catch (error) {
      handleErrorWithToast(error);
    }
  };

  return <LoginForm onSubmit={onSubmit} className={className}></LoginForm>;
}
