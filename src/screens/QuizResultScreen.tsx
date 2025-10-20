import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import AnimatedButton from '../components/AnimatedButton';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { resetQuiz } from '../redux/slices/quizSlice';

type QuizResultScreenRouteProp = RouteProp<RootStackParamList, 'QuizResult'>;


const { width } = Dimensions.get('window');

const QuizResultScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

  const { score, total } = route.params;
  const dispatch = useAppDispatch();
  const { questions, selectedAnswers } = useAppSelector((state) => state.quiz);

  const percentage = (score / total) * 100;
  const scale = useSharedValue(0);
  const progressValue = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      )
    );

    progressValue.value = withDelay(
      600,
      withTiming(percentage / 100, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
  }, []);

  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getResultMessage = () => {
    if (percentage === 100) return { emoji: '🎉', text: 'Perfect Score!' };
    if (percentage >= 80) return { emoji: '🌟', text: 'Excellent!' };
    if (percentage >= 60) return { emoji: '👍', text: 'Good Job!' };
    if (percentage >= 40) return { emoji: '💪', text: 'Keep Trying!' };
    return { emoji: '📚', text: 'Study More!' };
  };

  const resultMessage = getResultMessage();

  const handleRetakeQuiz = () => {
    dispatch(resetQuiz());
    navigation.navigate('Quiz');
  };

  const handleGoHome = () => {
    dispatch(resetQuiz());
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.header}>
            <Text style={styles.title}>Quiz Completed!</Text>
            <Text style={styles.subtitle}>Here are your results</Text>
          </Animated.View>

          {/* Result Card */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(200)}
            style={styles.resultCard}>
            <Animated.View style={[styles.emojiContainer, animatedScaleStyle]}>
              <Text style={styles.emoji}>{resultMessage.emoji}</Text>
            </Animated.View>

            <Text style={styles.resultMessage}>{resultMessage.text}</Text>

            {/* Score Display */}
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Text style={styles.score}>
                {score} / {total}
              </Text>
              <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
            </View>

            {/* Progress Circle */}
            <View style={styles.progressContainer}>
              <Progress.Circle
                progress={percentage / 100}
                size={180}
                thickness={12}
                color={percentage >= 60 ? '#48bb78' : '#e53e3e'}
                unfilledColor="rgba(0, 0, 0, 0.1)"
                borderWidth={0}
                showsText
                formatText={() => `${percentage.toFixed(0)}%`}
                textStyle={styles.progressText}
                animated
              />
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{score}</Text>
                <Text style={styles.statLabel}>✓ Correct</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.wrongValue]}>
                  {total - score}
                </Text>
                <Text style={styles.statLabel}>✗ Wrong</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </Animated.View>

          {/* Detailed Results */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(400)}
            style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Question Breakdown</Text>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.answer;

              return (
                <View key={question.id} style={styles.questionItem}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>Q{index + 1}</Text>
                    <Text style={isCorrect ? styles.correctBadge : styles.wrongBadge}>
                      {isCorrect ? '✓ Correct' : '✗ Wrong'}
                    </Text>
                  </View>
                  <Text style={styles.questionText} numberOfLines={2}>
                    {question.question}
                  </Text>
                  {!isCorrect && (
                    <View style={styles.answerInfo}>
                      <Text style={styles.yourAnswer}>
                        Your answer: <Text style={styles.wrongAnswer}>{userAnswer || 'Not answered'}</Text>
                      </Text>
                      <Text style={styles.correctAnswer}>
                        Correct: <Text style={styles.correctAnswerText}>{question.answer}</Text>
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(600)}
            style={styles.buttonsContainer}>
            <AnimatedButton
              title="🔄 Retake Quiz"
              onPress={handleRetakeQuiz}
              colors={['#4facfe', '#00f2fe']}
              style={styles.button}
            />
            <AnimatedButton
              title="🏠 Go Home"
              onPress={handleGoHome}
              colors={['#fa709a', '#fee140']}
              style={styles.button}
            />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 20,
  },
  emojiContainer: {
    marginBottom: 16,
  },
  emoji: {
    fontSize: 80,
    fontFamily: "PoppinsMedium",
  },
  resultMessage: {
    fontSize: 28,
    fontFamily: "PoppinsBold",
    color: '#2D3748',
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#718096',
    fontFamily: "PoppinsMedium",
    marginBottom: 8,
  },
  score: {
    fontSize: 48,
    fontFamily: "PoppinsBold",
    color: '#667eea',
  },
  percentage: {
    fontSize: 20,
    color: '#4A5568',
    fontFamily: "PoppinsMedium",
    marginTop: 4,
  },
  progressContainer: {
    marginVertical: 24,
  },
  progressText: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
    color: '#2D3748',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontFamily: "PoppinsBold",
    color: '#48bb78',
    marginBottom: 4,
  },
  wrongValue: {
    color: '#e53e3e',
  },
  statLabel: {
    fontSize: 13,
    color: '#718096',
    fontFamily: "PoppinsMedium",
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  detailsTitle: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionItem: {
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    color: '#667eea',
  },
  correctBadge: {
    fontSize: 12,
    fontFamily: "PoppinsBold",
    color: '#48bb78',
    backgroundColor: '#C6F6D5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wrongBadge: {
    fontSize: 12,
    fontFamily: "PoppinsBold",
    color: '#e53e3e',
    backgroundColor: '#FED7D7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionText: {
    fontSize: 14,
    color: '#2D3748',
    fontFamily: "PoppinsMedium",
    lineHeight: 20,
  },
  answerInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  yourAnswer: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: '#4A5568',
    marginBottom: 4,
  },
  wrongAnswer: {
    color: '#e53e3e',
    fontWeight: '600',
  },
  correctAnswer: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: '#4A5568',
  },
  correctAnswerText: {
    color: '#48bb78',
    fontFamily: "PoppinsMedium",
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  button: {
    width: '100%',
  },
});

export default QuizResultScreen;