import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiShield, FiZap, FiCheckCircle } from 'react-icons/fi';

export default function Login({ onLogin }) {
  const handle = async (cr) => {
    try {
      const r = await axios.post('http://localhost:8080/auth/google', {
        credential: cr.credential,
      });
      const { token, name, picture, email } = r.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, picture, email }));
      toast.success('Welcome back, ' + (name?.split(' ')[0] || 'User') + '!')
      onLogin({ token, name, picture, email });
    } catch {
      toast.error('Login failed. Please try again.')
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#08090a] text-white px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse duration-[5000ms]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-2xl border border-violet-500/20 rounded-[32px] shadow-2xl overflow-hidden p-10">

          {/* Header/Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-violet-600/10 p-4 rounded-2xl border border-violet-500/30 mb-6 group cursor-default">
              <FiShield size={40} className="text-violet-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">
              Cert<span className="text-violet-500">InSync</span>
            </h1>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              Identity & Synchronization
            </p>
          </div>

          {/* Google Login Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-violet-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex justify-center py-2">
              <GoogleLogin
                onSuccess={handle}
                onError={() => toast.error('Google authentication failed. Please try again.')}
                theme="filled_black"
                size="large"
                text="signin_with"
                shape="pill"
                width="100%"
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-neutral-600 font-medium leading-relaxed">
              Enter the production environment.<br />
              Secure authentication powered by Google.
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}
