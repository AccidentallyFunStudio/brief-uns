import React, { ReactNode } from 'react';

interface StepCardProps {
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
}

export const StepCard: React.FC<StepCardProps> = ({ title, description, icon, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 w-full max-w-md mx-auto transform transition-all animate-fade-in-up">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="text-4xl mb-4 p-4 bg-uns-sky/10 text-uns-cerulean rounded-full w-20 h-20 flex items-center justify-center border border-uns-sky/20">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-uns-cerulean uppercase tracking-wide">{title}</h2>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-xs">{description}</p>
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
