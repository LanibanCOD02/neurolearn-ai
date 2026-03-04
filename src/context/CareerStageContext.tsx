import React, { createContext, useContext, useState } from 'react';

type CareerStage = 'intro' | 'domain-select' | 'stage1-questions' | 'stage1-result' | 'stage2-questions' | 'final-result' | null;

interface CareerStageContextType {
  stage: CareerStage;
  setStage: (stage: CareerStage) => void;
}

const CareerStageContext = createContext<CareerStageContextType | undefined>(undefined);

export const CareerStageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStage] = useState<CareerStage>(null);

  return (
    <CareerStageContext.Provider value={{ stage, setStage }}>
      {children}
    </CareerStageContext.Provider>
  );
};

export const useCareerStage = () => {
  const context = useContext(CareerStageContext);
  if (context === undefined) {
    throw new Error('useCareerStage must be used within a CareerStageProvider');
  }
  return context;
};
