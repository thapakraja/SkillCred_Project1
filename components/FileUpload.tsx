import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (file: File, questionCount: number) => void;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, error }) => {
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
    w-full max-w-2xl bg-surface/50 border rounded-xl p-12 text-center cursor-pointer
    transition-all duration-300 ease-in-out
    ${isDragging ? 'border-primary shadow-glow scale-105' : 'border-gray-700 hover:border-primary hover:shadow-glow'}
  `;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 w-full max-w-2xl">
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
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
            <UploadIcon className="w-16 h-16 mb-4 text-gray-500" />
            <p className="text-xl font-semibold">Drag & drop your PDF here</p>
            <p className="text-gray-400 mt-1">or click to browse</p>

            <div className="mt-6 w-full max-w-xs">
              <label htmlFor="question-count" className="block text-sm font-medium text-gray-400 mb-2">
                Number of Questions
              </label>
              <select
                id="question-count"
                name="question-count"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-surface border border-gray-600 rounded-md py-2 px-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>

            <p className="text-sm text-gray-500 mt-6">Max file size: 50MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;