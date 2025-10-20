import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CourseCard from '../components/CourseCard';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCourses } from '../redux/slices/courseSlice';
import { Course } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const CourseListScreen = () => {
    const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { courses, loading, error, lastFetched } = useAppSelector(
    (state) => state.courses
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch courses on mount if not already loaded
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchCourses());
    setRefreshing(false);
  };

  const handleCoursePress = (course: Course) => {
    // You can navigate to course details screen here
    console.log('Course pressed:', course.title);
  };

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.headerCard}>
      <Text style={styles.headerTitle}>Available Courses</Text>
      <Text style={styles.headerSubtitle}>
        {courses.length} courses available offline
      </Text>
      {lastFetched && (
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(lastFetched).toLocaleDateString()}
        </Text>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.offlineText}>Showing cached courses</Text>
        </View>
      )}
    </Animated.View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📚</Text>
      <Text style={styles.emptyTitle}>No Courses Available</Text>
      <Text style={styles.emptyText}>
        Pull down to refresh and load courses
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  };

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
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>My Courses</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <CourseCard
            title={item.title}
            description={item.description}
            duration={item.duration}
            level={item.level}
            instructor={item.instructor}
            thumbnail={item.thumbnail}
            index={index}
            onPress={() => handleCoursePress(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.listContent,
          courses.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
            title="Pull to refresh"
            titleColor="#667eea"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingBottom: 20,
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
  headerTitleText: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 60,
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "PoppinsBold",
    color: '#2D3748',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#718096',
    fontFamily: "PoppinsMedium",
  },
  lastUpdated: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: '#A0AEC0',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FED7D7',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#c53030',
    fontFamily: "PoppinsBold",
    marginBottom: 4,
  },
  offlineText: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: '#742a2a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    fontFamily: "PoppinsMedium",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    color: '#2D3748',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default CourseListScreen;