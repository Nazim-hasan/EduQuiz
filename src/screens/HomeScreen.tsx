import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import AnimatedButton from '../components/AnimatedButton';



const HomeScreen = () => {

  // const navigation = useNavigation<NativeStackNavigationProp<AppRootStackParamList, 'Tab'>>();
  const navigation = useNavigation<any>();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    rotate.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedFloatingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

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
          {/* Animated Background Circles */}
          <Animated.View
            style={[styles.circle1, animatedRotateStyle, animatedFloatingStyle]}
          />
          <Animated.View style={[styles.circle2, animatedRotateStyle]} />

          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(200)}
            style={[styles.header, Platform.OS === 'ios' ? { marginTop: 60 } : {}]}>
            <Text style={styles.logo}>📚</Text>
            <Text style={styles.title}>EduQuiz</Text>
            <Text style={styles.subtitle}>
              Your Gateway to Knowledge & Growth
            </Text>
          </Animated.View>

          {/* Welcome Card */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(400)}
            style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome Back! 👋</Text>
            <Text style={styles.welcomeText}>
              Ready to continue your learning journey? Choose an option below to
              get started.
            </Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(600)}
            style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <AnimatedButton
                title="📝 Start Quiz"
                onPress={() => navigation.navigate('Quiz')}
                colors={['#4facfe', '#00f2fe']}
                style={styles.button}
              />
              <Text style={styles.buttonDescription}>
                Test your knowledge with interactive quizzes
              </Text>
            </View>

            <View style={styles.buttonWrapper}>
              <AnimatedButton
                title="📚 Browse Courses"
                onPress={() => navigation.navigate('CourseList')}
                colors={['#fa709a', '#fee140']}
                style={styles.button}
              />
              <Text style={styles.buttonDescription}>
                Explore courses available offline
              </Text>
            </View>
          </Animated.View>

          {/* Stats Card */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(800)}
            style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>∞</Text>
                <Text style={styles.statLabel}>Learning</Text>
              </View>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(1000)}
            style={styles.footer}>
            <Text style={styles.footerText}>
              "Education is the most powerful weapon which you can use to change
              the world." - Nelson Mandela
            </Text>
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
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 100,
    left: -50,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    color: '#2D3748',
    marginBottom: 5,
    fontFamily: "PoppinsBold",
  },
  welcomeText: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: '#4A5568',
    lineHeight: 20,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    gap: 24,
  },
  buttonWrapper: {
    gap: 8,
  },
  button: {
    width: '100%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontFamily: "PoppinsMedium",
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    marginTop: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: '#2D3748',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#718096',
    fontFamily: "PoppinsMedium",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  footer: {
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    fontFamily: "PoppinsMedium",
  },
});

export default HomeScreen;