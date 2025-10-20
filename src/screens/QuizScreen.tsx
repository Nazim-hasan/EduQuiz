import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import Animated, {
  FadeIn,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import AnimatedButton from '../components/AnimatedButton';
import QuizCard from '../components/QuizCard';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  nextQuestion,
  previousQuestion,
  resetQuiz,
  selectAnswer,
  submitQuiz,
} from '../redux/slices/quizSlice';
import { SafeAreaView } from 'react-native-safe-area-context';


const QuizScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { questions, currentQuestionIndex, selectedAnswers, isQuizCompleted } =
    useAppSelector((state) => state.quiz);

  const progressValue = useSharedValue(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const hasSelectedAnswer = selectedAnswers[currentQuestion?.id] !== undefined;

  useEffect(() => {
    progressValue.value = withTiming(
      (currentQuestionIndex + 1) / questions.length,
      { duration: 300 }
    );
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    dispatch(resetQuiz());
  }, []);

  const handleSelectAnswer = (answer: string) => {
    dispatch(selectAnswer({ questionId: currentQuestion.id, answer }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      dispatch(nextQuestion());
    }
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  const handleSubmit = () => {
    dispatch(submitQuiz());
    const score = calculateScore();
    navigation.navigate('QuizResult', {
      score,
      total: questions.length,
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        correct++;
      }
    });
    return correct;
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quiz Challenge</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress Bar */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </Text>
            </View>
            <Progress.Bar
              progress={(currentQuestionIndex + 1) / questions.length}
              width={null}
              height={8}
              color="#4facfe"
              unfilledColor="rgba(255, 255, 255, 0.3)"
              borderWidth={0}
              borderRadius={4}
              animated
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <QuizCard
          question={currentQuestion.question}
          options={currentQuestion.options}
          selectedAnswer={selectedAnswers[currentQuestion.id]}
          onSelectAnswer={handleSelectAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {!isFirstQuestion && (
            <AnimatedButton
              title="← Previous"
              onPress={handlePrevious}
              colors={['#a8a8a8', '#8a8a8a']}
              style={styles.navButton}
            />
          )}

          <AnimatedButton
            title={isLastQuestion ? '✓ Submit Quiz' : 'Next →'}
            onPress={handleNext}
            colors={
              isLastQuestion
                ? ['#48bb78', '#38a169']
                : ['#667eea', '#764ba2']
            }
            style={[styles.navButton, isFirstQuestion && styles.fullWidthButton]}
            disabled={!hasSelectedAnswer}
          />
        </View>

        {/* Answer Counter */}
        <Animated.View entering={FadeIn.delay(400)} style={styles.answerCounter}>
          <Text style={styles.answerCounterText}>
            Answered: {Object.keys(selectedAnswers).length} / {questions.length}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 60,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 40,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  navButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
  answerCounter: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    alignItems: 'center',
  },
  answerCounterText: {
    fontSize: 15,
    color: '#667eea',
    fontFamily: "PoppinsMedium",
  },
});

export default QuizScreen;