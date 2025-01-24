import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Lock, X, AlertCircle, Loader } from 'lucide-react';

const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-[#38ff9b]/10 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${5 + Math.random() * 10}s linear infinite`,
          animationDelay: `${-Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

const LoginPage = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await window.api.validateLicense(licenseKey);
      if (result.success) {
        // Success animation before redirect
        await new Promise(resolve => setTimeout(resolve, 800));
        navigate('/');
      } else {
        setError(result.message || 'Invalid license key');
      }
    } catch (err) {
      setError('Failed to validate license');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#14141F] flex items-center justify-center p-4">
      <ParticleBackground />
      
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#38ff9b]/5 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full filter blur-[100px] animate-pulse animation-delay-1000" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,255,155,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,255,155,0.03)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative w-full max-w-lg">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="relative inline-block group">
            <div className="w-24 h-24 mb-4 mx-auto relative">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-xl border-2 border-[#38ff9b]/20 animate-ping" />
              <div className="absolute inset-0 rounded-xl border-2 border-[#38ff9b]/20 animate-pulse" />
              <div className="relative w-full h-full rounded-xl bg-[#2A2A40] flex items-center justify-center
                           group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-12 h-12 text-[#38ff9b]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#38ff9b] to-[#32d87f] 
                         text-transparent bg-clip-text">
              Vyper AI
            </h1>
          </div>
          <p className="text-gray-400 mt-2">Enter your license key to get started</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            {/* Input with animated border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#38ff9b]/50 to-[#32d87f]/50 
                          rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 
                          group-hover:duration-200" />
            
            <div className="relative bg-[#1B1B26] rounded-xl">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Key className="w-5 h-5 text-[#38ff9b]" />
              </div>
              
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => {
                  setLicenseKey(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-[#38ff9b]/50
                         placeholder-gray-500"
                placeholder="Enter your license key"
              />

              {licenseKey && (
                <button
                  type="button"
                  onClick={() => setLicenseKey('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
                           hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                  </button>
              )}

              {error && (
                <div className="absolute -bottom-12 left-0 right-0 bg-red-500/10 text-red-500 p-3 rounded-lg 
                              flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !licenseKey.trim()}
            className={`w-full bg-gradient-to-r from-[#38ff9b] to-[#32d87f] text-[#14141F] 
                     font-medium py-4 rounded-xl relative overflow-hidden group
                     transform hover:-translate-y-1 transition-all duration-300
                     ${isLoading || !licenseKey.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-[#38ff9b]/20'}`}
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full 
                          group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Access Vyper AI
                </>
              )}
            </span>
          </button>
        </form>

        {/* Floating features */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: Zap, title: 'Fast & Reliable', desc: 'Optimized performance' },
            { icon: Shield, title: 'Secure Access', desc: 'Enterprise-grade security' },
            { icon: Network, title: 'AI-Powered', desc: 'Advanced automation' }
          ].map((feature, i) => (
            <div key={i} 
                 className="bg-[#1B1B26] p-4 rounded-xl hover:bg-[#2A2A40] 
                          transform hover:-translate-y-1 transition-all duration-300">
              <div className="p-2 rounded-lg bg-[#38ff9b]/10 w-fit mb-3">
                <feature.icon className="w-5 h-5 text-[#38ff9b]" />
              </div>
              <h3 className="text-white font-medium text-sm mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Status indicator */}
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#1B1B26] 
                      px-4 py-2 rounded-full shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#38ff9b] animate-pulse" />
          <span className="text-gray-400 text-sm">System Operational</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;