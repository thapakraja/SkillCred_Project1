import React, { useState, useCallback } from 'react';
import { AppState, Quiz, Question } from './types';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import QuizReviewer from './components/QuizReviewer';
import { extractTextFromPdf } from './services/pdfProcessor';
import { generateQuizFromText } from './services/geminiService';
import { exportQuizToPdf, exportQuizToCsv } from './services/exportService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File, questionCount: number) => {
    setAppState(AppState.LOADING);
    setError(null);
    setFileName(file.name);

    try {
      setLoadingMessage('Extracting text from PDF...');
      const text = await extractTextFromPdf(file);
      
      setLoadingMessage('Generating quiz with Gemini AI...');
      const generatedQuiz = await generateQuizFromText(text, questionCount);

      setQuiz(generatedQuiz);
      setAppState(AppState.REVIEW);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate quiz. ${errorMessage}`);
      setAppState(AppState.UPLOAD);
    } finally {
        setLoadingMessage('');
    }
  }, []);

  const handleExportPdf = () => {
    if (quiz) {
      exportQuizToPdf(quiz, fileName.replace('.pdf', ''));
    }
  };

  const handleExportCsv = () => {
    if (quiz) {
      exportQuizToCsv(quiz, fileName.replace('.pdf', ''));
    }
  };
  
  const handleStartOver = () => {
    setQuiz(null);
    setError(null);
    setFileName('');
    setAppState(AppState.UPLOAD);
  };

  const handleGoBack = () => {
    setQuiz(null);
    setError(null);
    setAppState(AppState.UPLOAD);
    // Keep the fileName so user knows which file they uploaded
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <Loader message={loadingMessage} />;
      case AppState.REVIEW:
        if (quiz) {
          return (
            <QuizReviewer
              quiz={quiz}
              onExportPdf={handleExportPdf}
              onExportCsv={handleExportCsv}
              onStartOver={handleStartOver}
              onGoBack={handleGoBack}
              fileName={fileName}
            />
          );
        }
        return null; // Should not happen
      case AppState.UPLOAD:
      default:
        return <FileUpload onFileUpload={handleFileUpload} error={error} previousFileName={fileName} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 animate-fade-in">
       <header className="w-full max-w-5xl mb-8 text-center animate-slide-up">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent pb-2">
                QuizGen AI
            </h1>
            <p className="mt-3 text-lg text-on-surface-light font-medium">
                Instantly create quizzes from your PDF documents.
            </p>
        </header>
      <main className="w-full max-w-5xl flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;