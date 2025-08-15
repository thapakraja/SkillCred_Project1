import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl shadow-medium border border-border-light animate-fade-in-up">
      <div className="flex space-x-3 mb-8" aria-label="Loading..." role="status">
        <div className="h-5 w-5 rounded-full bg-primary animate-pulse-slow" style={{ animationDuration: '1.2s' }}></div>
        <div className="h-5 w-5 rounded-full bg-primary animate-pulse-slow" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }}></div>
        <div className="h-5 w-5 rounded-full bg-primary animate-pulse-slow" style={{ animationDuration: '1.2s', animationDelay: '0.4s' }}></div>
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">{message}</h3>
      <p className="text-on-surface-light">This may take a moment...</p>
    </div>
  );
};

export default Loader;