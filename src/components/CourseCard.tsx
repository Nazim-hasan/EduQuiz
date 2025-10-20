import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from '@d11/react-native-fast-image';

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  thumbnail: string;
  index: number;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  duration,
  level,
  instructor,
  thumbnail,
  index,
  onPress,
}) => {
  const getLevelColor = () => {
    switch (level) {
      case 'Beginner':
        return ['#48bb78', '#38a169'];
      case 'Intermediate':
        return ['#ed8936', '#dd6b20'];
      case 'Advanced':
        return ['#e53e3e', '#c53030'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.touchable}>
        <View style={styles.card}>
          <FastImage source={{ uri: thumbnail }} style={styles.thumbnail} />
          
          <LinearGradient
            colors={getLevelColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.levelBadge}>
            <Text style={styles.levelText}>{level}</Text>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>

            <View style={styles.footer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📚 {duration}</Text>
                <Text style={styles.instructor}>👨‍🏫 {instructor}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  touchable: {
    borderRadius: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#E2E8F0',
    resizeMode: 'contain',
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 20,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: "PoppinsBold",
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: '#2D3748',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    fontFamily: "PoppinsMedium",
    color: '#718096',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#4A5568',
    fontFamily: "PoppinsMedium",
  },
  instructor: {
    fontSize: 13,
    color: '#667eea',
    fontFamily: "PoppinsMedium",
  },
});

export default CourseCard;