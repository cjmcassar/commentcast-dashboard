import LoginForm from '@/components/layouts/auth/Login';

import { signup } from '../signup/actions';
import { login } from './actions';

export default function LoginPage() {
  return (
    <div className="container">
      <LoginForm login={login} signup={signup} />
    </div>
  );
}
