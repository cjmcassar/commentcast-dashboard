import LoginForm from '@/components/layouts/auth/Login';

import { signup } from '../signup/actions';
import { login, loginWithGoogle } from './actions';

export default function LoginPage() {
  return (
    <div className="container flex justify-center items-center min-h-screen">
      <LoginForm
        login={login}
        signup={signup}
        loginWithGoogle={loginWithGoogle}
      />
    </div>
  );
}
