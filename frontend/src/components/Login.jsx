import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Login({ onLogin }) {
  const handle = async (cr) => {
    try {
      const r = await axios.post('http://localhost:8080/auth/google', {
        credential: cr.credential,
      });
      const { token, name, picture, email } = r.data;
      localStorage.setItem('token', token);
      onLogin({ token, name, picture, email });
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-neutral-900 text-white px-4">
      <div className="bg-[#0e0e0e] border border-neutral-800 rounded-2xl shadow-xl w-full max-w-md text-center p-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl mb-2">🏅</span>
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-neutral-400 text-sm mt-1">Sign in to continue to your account</p>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center my-6">
          <GoogleLogin
            onSuccess={handle}
            onError={() => alert('Login error')}
            theme="outline"
            size="large"
            text="continue_with"
            shape="pill"
          />
        </div>

        {/* Terms & Privacy */}
        <p className="text-xs text-neutral-500 mt-4">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
