import { useNavigation } from '@react-navigation/native';
import React from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import CourseCard from '../components/CourseCard';
import { useGetCoursesQuery } from '../redux/services/coursesApi';
import { Course } from '../types';

const CourseListScreen = () => {
  const navigation = useNavigation<any>();
  const { 
    data, 
    error, 
    isLoading, 
    isFetching, 
    refetch 
  } = useGetCoursesQuery({}, {
    refetchOnMountOrArgChange: true,
  });

  const courses = data || [];
  const hasError = !!error;


  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  const handleCoursePress = (course: Course) => {};

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.headerCard}>
      <Text style={styles.headerTitle}>Available Courses</Text>
      <Text style={styles.headerSubtitle}>
        {courses.length} courses available
      </Text>
    </Animated.View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📚</Text>
      <Text style={styles.emptyTitle}>
        {isLoading ? 'Loading...' : 'No Courses Available'}
      </Text>
      <Text style={styles.emptyText}>
        {isLoading
          ? 'Fetching courses from server...'
          : hasError
          ? 'Unable to load courses. Please check your connection and try again.'
          : 'Pull down to refresh and load courses'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading && !isFetching) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>
          {isLoading ? 'Loading courses...' : 'Refreshing...'}
        </Text>
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
            refreshing={isFetching}
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
    fontFamily: 'PoppinsBold',
  },
  headerTitleText: {
    fontSize: 20,
    fontFamily: 'PoppinsBold',
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
    fontFamily: 'PoppinsBold',
    color: '#2D3748',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#718096',
    fontFamily: 'PoppinsMedium',
  },
  lastUpdated: {
    fontSize: 13,
    fontFamily: 'PoppinsMedium',
    color: '#A0AEC0',
    marginTop: 8,
  },
  offlineContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF5E7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  offlineBadge: {
    fontSize: 13,
    color: '#D68910',
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
  },
  onlineContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E6FFFA',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#38B2AC',
  },
  onlineBadge: {
    fontSize: 13,
    color: '#2C7A7B',
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: '#2D3748',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    color: '#667eea',
  },
});

export default CourseListScreen;