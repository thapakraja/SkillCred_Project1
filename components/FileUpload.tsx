import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (file: File, questionCount: number) => void;
  error: string | null;
  previousFileName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, error, previousFileName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(10);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file, questionCount);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file, questionCount);
    } else {
      alert('Please upload a valid PDF file.');
    }
  }, [onFileUpload, questionCount]);

  const dropzoneClasses = `
    w-full max-w-2xl bg-white border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
    transition-all duration-300 ease-in-out card-hover
    ${isDragging 
      ? 'border-primary bg-primary-light shadow-glow scale-105' 
      : 'border-border-light hover:border-primary hover:bg-surface-hover hover:shadow-medium'
    }
  `;

  return (
    <div className="w-full flex flex-col items-center justify-center animate-fade-in-up">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-8 w-full max-w-2xl shadow-soft">
          <p className="font-semibold text-lg mb-2">An Error Occurred</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {previousFileName && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-2xl mb-8 w-full max-w-2xl shadow-soft">
          <p className="font-semibold text-lg mb-2">Welcome Back!</p>
          <p className="text-blue-600">You were working with: <span className="font-semibold">{previousFileName}</span></p>
          <p className="text-blue-600 text-sm mt-2">Upload a new PDF or the same file to generate a new quiz.</p>
        </div>
      )}
      
      <div
        className={dropzoneClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center text-on-surface">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mb-6">
              <UploadIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-on-surface mb-2">Drag & drop your PDF here</h2>
            <p className="text-on-surface-light mb-8">or click to browse</p>

            <div className="w-full max-w-xs mb-8">
              <label htmlFor="question-count" className="block text-sm font-medium text-on-surface mb-3">
                Number of Questions
              </label>
              <select
                id="question-count"
                name="question-count"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-white border-2 border-border-light rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 input-modern"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
              </select>
            </div>

            <p className="text-sm text-on-surface-light">Max file size: 50MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;