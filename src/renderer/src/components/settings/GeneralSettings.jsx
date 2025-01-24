// src/renderer/src/components/settings/GeneralSettings.jsx
import { Monitor, Moon, Sun, Globe2 } from 'lucide-react';

const ThemeCard = ({ theme, active, onClick }) => (
  <button
    onClick={() => onClick(theme.id)}
    className={`relative p-4 rounded-xl transition-all duration-300 ${
      active ? 'bg-[#38ff9b]/10 border-[#38ff9b]' : 'bg-[#2A2A40] border-transparent'
    } border-2 group hover:border-[#38ff9b]/50`}
  >
    <div className="w-full aspect-video rounded-lg mb-4 overflow-hidden">
      <img 
        src={theme.preview} 
        alt={theme.name}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="flex items-center justify-between">
      <span className="text-white font-medium">{theme.name}</span>
      {theme.id === 'system' ? (
        <Monitor className="w-5 h-5 text-[#38ff9b]" />
      ) : theme.id === 'dark' ? (
        <Moon className="w-5 h-5 text-[#38ff9b]" />
      ) : (
        <Sun className="w-5 h-5 text-[#38ff9b]" />
      )}
    </div>
  </button>
);

const LanguageOption = ({ language, active, onClick }) => (
  <button
    onClick={() => onClick(language.code)}
    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
      active ? 'bg-[#38ff9b] text-[#14141F]' : 'bg-[#2A2A40] text-white hover:bg-[#2A2A40]/80'
    }`}
  >
    <img 
      src={language.flag} 
      alt={language.name}
      className="w-6 h-6 rounded-full"
    />
    <span className="font-medium">{language.name}</span>
  </button>
);

const GeneralSettings = ({ settings, onChange }) => {
  const themes = [
    { id: 'system', name: 'Sistema', preview: '/themes/system.png' },
    { id: 'dark', name: 'Oscuro', preview: '/themes/dark.png' },
    { id: 'light', name: 'Claro', preview: '/themes/light.png' }
  ];

  const languages = [
    { code: 'es', name: 'Español', flag: '/flags/es.png' },
    { code: 'en', name: 'English', flag: '/flags/en.png' },
    { code: 'fr', name: 'Français', flag: '/flags/fr.png' }
  ];

  return (
    <div className="space-y-8">
      {/* Tema */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Tema</h2>
        <div className="grid grid-cols-3 gap-6">
          {themes.map(theme => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              active={settings.theme === theme.id}
              onClick={(themeId) => onChange({ theme: themeId })}
            />
          ))}
        </div>
      </div>

      {/* Idioma */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Globe2 className="w-6 h-6 text-[#38ff9b]" />
          Idioma
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {languages.map(lang => (
            <LanguageOption
              key={lang.code}
              language={lang}
              active={settings.language === lang.code}
              onClick={(langCode) => onChange({ language: langCode })}
            />
          ))}
        </div>
      </div>

      {/* Actualizaciones */}
      <div className="bg-[#1B1B26] rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Actualizaciones automáticas</h3>
            <p className="text-gray-400 text-sm mt-1">
              Mantén Vyper AI siempre actualizado con las últimas mejoras
            </p>
          </div>
          <button
            onClick={() => onChange({ autoUpdate: !settings.autoUpdate })}
            className={`w-12 h-6 rounded-full transition-colors duration-300 
                     ${settings.autoUpdate ? 'bg-[#38ff9b]' : 'bg-[#2A2A40]'}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300
                       ${settings.autoUpdate ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;