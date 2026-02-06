import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';

export default async function BackofficePage() {
  const session = await auth();

  if (session) {
    redirect('/backoffice/dashboard');
  }

  return <LoginForm />;
}

