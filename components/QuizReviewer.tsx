import React, { useState } from 'react';
import { Quiz, Question, QuestionType } from '../types';
import { CsvIcon } from './icons/CsvIcon';
import { PdfIcon } from './icons/PdfIcon';

interface QuizReviewerProps {
  quiz: Quiz;
  fileName: string;
  onExportPdf: () => void;
  onExportCsv: () => void;
  onStartOver: () => void;
  onGoBack: () => void;
}

const QuizReviewer: React.FC<QuizReviewerProps> = ({
  quiz,
  fileName,
  onExportPdf,
  onExportCsv,
  onStartOver,
  onGoBack,
}) => {
  // State to track which answers are visible using a Set of question IDs
  const [visibleAnswers, setVisibleAnswers] = useState<Set<string>>(new Set());

  // Toggles the visibility of a single question's answer
  const toggleAnswerVisibility = (questionId: string) => {
    setVisibleAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const primaryButtonClasses = "flex items-center bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-glow btn-hover";

  return (
    <div className="w-full bg-white rounded-2xl shadow-medium border border-border-light p-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-border-light pb-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-2">Review Quiz</h2>
          <p className="text-on-surface-light">Generated from: <span className="font-semibold text-primary">{fileName}</span></p>
        </div>
        <div className="flex items-center space-x-3 mt-6 sm:mt-0">
          <button onClick={onExportPdf} className={primaryButtonClasses}>
            <PdfIcon className="w-5 h-5 mr-2" /> Export PDF
          </button>
          <button onClick={onExportCsv} className={primaryButtonClasses}>
            <CsvIcon className="w-5 h-5 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q, qIndex) => (
          <div key={q.id} className="bg-surface-hover p-6 rounded-2xl border border-border-light card-hover">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-primary bg-primary-light px-4 py-2 rounded-full">
                {qIndex + 1}. {q.type === QuestionType.MCQ ? 'Multiple Choice' : 'True/False'}
              </span>
              <button
                onClick={() => toggleAnswerVisibility(q.id)}
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-200 btn-hover px-3 py-1 rounded-lg hover:bg-primary-light"
              >
                {visibleAnswers.has(q.id) ? 'Hide Answer' : 'Show Answer'}
              </button>
            </div>
            <div className="w-full bg-white border-2 border-border-light rounded-xl p-4 text-on-surface min-h-[60px] flex items-center shadow-soft">
              {q.question}
            </div>
            <div className="mt-4 space-y-3">
              {q.type === QuestionType.MCQ && q.options?.map((option, oIndex) => {
                  const isAnswerVisible = visibleAnswers.has(q.id);
                  const isCorrect = q.correctAnswer === option;
                  return (
                    <div key={oIndex} className="flex items-center pl-6">
                      <span className={`
                        ${isAnswerVisible && isCorrect ? 'text-primary font-semibold' : 'text-on-surface'}
                         transition-colors duration-300 text-sm
                      `}>
                         {String.fromCharCode(97 + oIndex)}) {option}
                      </span>
                    </div>
                  );
              })}
              {q.type === QuestionType.TF && ['True', 'False'].map(option => {
                  const isAnswerVisible = visibleAnswers.has(q.id);
                  const isCorrect = q.correctAnswer === option;
                  return (
                    <div key={option} className="flex items-center pl-6">
                      <span className={`
                        ${isAnswerVisible && isCorrect ? 'text-primary font-semibold' : 'text-on-surface'}
                         transition-colors duration-300 text-sm
                      `}>
                        {option}
                      </span>
                    </div>
                  );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-border-light flex justify-between items-center">
        <button 
          onClick={onGoBack}
          className="flex items-center bg-white border-2 border-border-light hover:border-primary hover:bg-primary-light text-on-surface hover:text-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200 btn-hover"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Go Back
        </button>
        <button 
          onClick={onStartOver} 
          className="bg-white border-2 border-border-light hover:border-border-hover hover:bg-surface-hover text-on-surface font-semibold py-3 px-6 rounded-xl transition-all duration-200 btn-hover"
        >
            Start Over
        </button>
      </div>
    </div>
  );
};

export default QuizReviewer;