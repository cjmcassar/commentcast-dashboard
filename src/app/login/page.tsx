import LoginForm from '@/components/layouts/auth/Login';

import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <div className="container">
      <LoginForm login={login} signup={signup} />
    </div>
  );
}
