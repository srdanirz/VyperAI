import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center bg-[#14141F]">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-xl text-gray-400">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-[#38ff9b] text-[#14141F] rounded-xl 
                   hover:bg-[#38ff9b]/80 transition-colors"
        >
          <Home className="w-5 h-5" />
          Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;