import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Sparkles, GitBranch, Box, Database } from 'lucide-react';

const TutorialStep = ({ step, onNext, onPrev, onSkip, currentStep, totalSteps }) => {
  const steps = {
    1: {
      title: "Bienvenido a Vyper AI",
      description: "Automatiza cualquier tarea web en minutos",
      image: <Sparkles className="w-16 h-16 text-[#38ff9b]" />,
      highlight: ".sidebar"
    },
    2: {
      title: "Crea tu primer flujo",
      description: "Arrastra y suelta componentes para crear automatizaciones",
      image: <GitBranch className="w-16 h-16 text-[#38ff9b]" />,
      highlight: ".flow-builder"
    },
    3: {
      title: "Gestiona tus agentes",
      description: "Monitorea y controla tus automatizaciones activas",
      image: <Box className="w-16 h-16 text-[#38ff9b]" />,
      highlight: ".agents-panel"
    }
  };

  const currentStepData = steps[step];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[480px] 
                 bg-[#1B1B26] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2A2A40]">
        <motion.div 
          className="h-full bg-[#38ff9b]" 
          initial={{ width: "0%" }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-[#2A2A40] rounded-xl">
            {currentStepData.image}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{currentStepData.title}</h3>
            <p className="text-gray-400">{currentStepData.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Paso {step} de {totalSteps}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onSkip}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Saltar tutorial
            </button>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={onPrev}
                  className="p-2 rounded-lg bg-[#2A2A40] hover:bg-[#2A2A40]/80 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-4 py-2 bg-[#38ff9b] text-[#14141F] rounded-lg
                         hover:bg-[#38ff9b]/80 transition-colors font-medium"
              >
                {step === totalSteps ? "Empezar" : "Siguiente"}
                {step !== totalSteps && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Highlight = ({ selector }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const element = document.querySelector(selector);
    if (element) {
      const { top, left, width, height } = element.getBoundingClientRect();
      setPosition({ top, left, width, height });
    }
  }, [selector]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 pointer-events-none"
      style={{
        maskImage: `path('M 0 0 v ${window.innerHeight} h ${window.innerWidth} V 0 H 0 Z 
                   M ${position.left} ${position.top} 
                   h ${position.width} v ${position.height} 
                   h -${position.width} v -${position.height} z')`
      }}
    >
      <div 
        className="absolute border-2 border-[#38ff9b] rounded-xl"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height
        }}
      />
    </div>
  );
};

export const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep === totalSteps) {
      setShowTutorial(false);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSkip = () => {
    setShowTutorial(false);
  };

  if (!showTutorial) return null;

  return (
    <AnimatePresence>
      <TutorialStep
        step={currentStep}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleSkip}
        totalSteps={totalSteps}
      />
      <Highlight selector={`.tutorial-step-${currentStep}`} />
    </AnimatePresence>
  );
};

export default Tutorial;