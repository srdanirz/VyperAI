import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Lock, Eye, EyeOff, Loader, Shield, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-[#38ff9b]/10 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        animate={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        transition={{
          duration: 10 + Math.random() * 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
  </div>
);

const Feature = ({ icon: Icon, title, description }) => (
  <motion.div 
    className="bg-[#1B1B26] p-4 rounded-xl hover:bg-[#2A2A40] transition-all duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="p-2 rounded-lg bg-[#38ff9b]/10 w-fit mb-3">
      <Icon className="w-5 h-5 text-[#38ff9b]" />
    </div>
    <h3 className="text-white font-medium text-sm mb-1">{title}</h3>
    <p className="text-gray-400 text-xs">{description}</p>
  </motion.div>
);

const Login = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo login
    await new Promise(r => setTimeout(r, 800));
    if (licenseKey.trim()) {
      toast.success('Welcome to Vyper AI!');
      navigate('/');
    } else {
      toast.error('Please enter a license key');
    }
    setIsLoading(false);
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
          <motion.div 
            className="relative inline-block group"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mb-4 mx-auto relative">
              <div className="absolute inset-0 rounded-xl border-2 border-[#38ff9b]/20 animate-ping" />
              <div className="absolute inset-0 rounded-xl border-2 border-[#38ff9b]/20 animate-pulse" />
              <div className="relative w-full h-full rounded-xl bg-[#2A2A40] flex items-center justify-center
                           group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-12 h-12 text-[#38ff9b]" />
              </div>
            </div>
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-[#38ff9b] to-[#32d87f] 
                         text-transparent bg-clip-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Vyper AI
            </motion.h1>
          </motion.div>
          <motion.p 
            className="text-gray-400 mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Enter your license key to get started
          </motion.p>
        </div>

        {/* Login form */}
        <motion.form 
          onSubmit={handleLogin}
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#38ff9b]/50 to-[#32d87f]/50 
                          rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 
                          group-hover:duration-200" />
            
            <div className="relative bg-[#1B1B26] rounded-xl">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Key className="w-5 h-5 text-[#38ff9b]" />
              </div>
              
              <input
                type={showPassword ? "text" : "password"}
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="w-full bg-transparent text-white pl-12 pr-12 py-4 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-[#38ff9b]/50
                         placeholder-gray-500"
                placeholder="Enter your license key"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
                         hover:bg-white/10 transition-colors"
              >
                {showPassword ? 
                  <EyeOff className="w-4 h-4 text-gray-400" /> :
                  <Eye className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !licenseKey.trim()}
            className="w-full bg-gradient-to-r from-[#38ff9b] to-[#32d87f] text-[#14141F] 
                     font-medium py-4 rounded-xl relative overflow-hidden group
                     transform hover:-translate-y-1 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg hover:shadow-[#38ff9b]/20"
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
        </motion.form>

        {/* Features */}
        <motion.div 
          className="mt-12 grid grid-cols-3 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Feature
            icon={Zap}
            title="Fast & Reliable"
            desc="Optimized performance"
          />
          <Feature  
            icon={Shield}
            title="Secure Access"
            desc="Enterprise-grade security"
          />
          <Feature
            icon={ArrowRight}  
            title="AI-Powered"
            desc="Advanced automation"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;