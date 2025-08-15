
export enum AppState {
  UPLOAD,
  LOADING,
  REVIEW,
}

export enum QuestionType {
  MCQ = 'MCQ',
  TF = 'TF',
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface Quiz {
  questions: Question[];
}
