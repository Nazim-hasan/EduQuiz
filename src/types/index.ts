export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  thumbnail: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: { [key: number]: string };
  score: number;
  isQuizCompleted: boolean;
}

export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}