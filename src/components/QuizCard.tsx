import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface QuizCardProps {
  question: string;
  options: string[];
  selectedAnswer?: string;
  onSelectAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      exiting={FadeOutLeft.duration(400)}
      layout={Layout.springify()}
      style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <Text style={styles.questionNumber}>
          Question {questionNumber} of {totalQuestions}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.question}>{question}</Text>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSelectAnswer(option)}
                activeOpacity={0.7}>
                <Animated.View
                  entering={FadeInRight.delay(index * 100).duration(400)}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                  ]}>
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}>
                      {option}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginHorizontal: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  questionNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    letterSpacing: 0.5,
  },
  content: {
    padding: 24,
  },
  question: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: '#2D3748',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    backgroundColor: '#EBF4FF',
    borderColor: '#667eea',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#667eea',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#667eea',
  },
  optionText: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: '#4A5568',
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#667eea',
    fontWeight: '600',
  },
});

export default QuizCard;