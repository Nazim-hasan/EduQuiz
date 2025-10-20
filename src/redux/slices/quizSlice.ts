import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question, QuizState } from '../../types';
import questionsData from '../../data/questions.json';

const initialState: QuizState = {
  questions: questionsData as Question[],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  score: 0,
  isQuizCompleted: false,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    selectAnswer: (state, action: PayloadAction<{ questionId: number; answer: string }>) => {
      const { questionId, answer } = action.payload;
      state.selectedAnswers[questionId] = answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    submitQuiz: (state) => {
      let correctAnswers = 0;
      state.questions.forEach((question) => {
        if (state.selectedAnswers[question.id] === question.answer) {
          correctAnswers += 1;
        }
      });
      state.score = correctAnswers;
      state.isQuizCompleted = true;
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.score = 0;
      state.isQuizCompleted = false;
    },
  },
});

export const { selectAnswer, nextQuestion, previousQuestion, submitQuiz, resetQuiz } =
  quizSlice.actions;

export default quizSlice.reducer;