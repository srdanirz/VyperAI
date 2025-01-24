// src/renderer/src/components/HelpCenter.jsx
import { Search, Book, MessageSquare, Play, ArrowRight } from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    {
      icon: Book,
      title: 'Documentación',
      description: 'Guías detalladas y referencia de API'
    },
    {
      icon: MessageSquare,
      title: 'Soporte',
      description: 'Obtén ayuda del equipo de Vyper'
    },
    {
      icon: Play,
      title: 'Tutoriales',
      description: 'Aprende con ejemplos prácticos'
    }
  ];

  const quickLinks = [
    'Primeros pasos',
    'Crear un flujo',
    'Configurar proxies',
    'Integrar APIs'
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors text-white"
      >
        <Book className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-[#14141F] w-full max-w-2xl rounded-xl shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Centro de Ayuda</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en la documentación..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1B1B26] text-white rounded-xl pl-12 pr-4 py-3 
                           border border-transparent focus:border-[#38ff9b]/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="p-4 bg-[#1B1B26] rounded-xl hover:bg-[#2A2A40] transition-colors
                             text-left group"
                  >
                    <category.icon className="w-6 h-6 text-[#38ff9b] mb-3" />
                    <h3 className="text-white font-medium mb-1">{category.title}</h3>
                    <p className="text-gray-400 text-sm">{category.description}</p>
                    <ArrowRight className="w-4 h-4 text-[#38ff9b] opacity-0 group-hover:opacity-100
                                       transform -translate-x-2 group-hover:translate-x-0
                                       transition-all duration-300" />
                  </button>
                ))}
              </div>

              <div>
                <h3 className="text-white font-medium mb-3">Enlaces rápidos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickLinks.map((link, index) => (
                    <button
                      key={index}
                      className="p-3 bg-[#1B1B26] rounded-lg text-left text-gray-400 hover:text-white
                               hover:bg-[#2A2A40] transition-colors"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { HelpCenter };