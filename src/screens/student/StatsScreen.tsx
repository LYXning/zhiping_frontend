/**
 * 教师端数据统计组件
 * 显示教师的数据统计和分析界面，包括班级数据、成绩分布等
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// 导入图标资源
import {
  calendarIcon,
  downloadIcon,
  chartIcon,
  trendingUpIcon,
  userIcon,
  homeIcon
} from '../../assets/icons';
import { STATUS_BAR_HEIGHT } from '../../utils/devicesUtils';

// 图标组件
const Icon = ({ name, size = 24, color = '#000' }) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = (iconName) => {
    switch (iconName) {
      case 'calendar':
        return calendarIcon;
      case 'download':
        return downloadIcon;
      case 'bar-chart-2':
        return chartIcon;
      case 'trending-up':
        return trendingUpIcon;
      case 'users':
        return userIcon; // 临时替代
      default:
        return homeIcon;
    }
  }

  return (
    <Image
      source={getIconSource(name)}
      style={{ width: size, height: size, tintColor: color }}
    />
  );
};

// 统计卡片组件
const StatCard = ({ title, value, change, changeType, bgColor }) => (
  <View style={[styles.statCard, { backgroundColor: bgColor }]}>
    <Text style={styles.statCardTitle}>{title}</Text>
    <Text style={styles.statCardValue}>{value}</Text>
    {change && (
      <View style={styles.statCardChange}>
        <Icon
          name={changeType === 'up' ? 'trending-up' : 'trending-down'}
          size={12}
          color={changeType === 'up' ? '#10b981' : '#ef4444'}
        />
        <Text
          style={[styles.statCardChangeText,
          { color: changeType === 'up' ? '#10b981' : '#ef4444' }]}
        >
          {change}
        </Text>
      </View>
    )}
  </View>
);

// 班级按钮组件
const ClassButton = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.classButton, active && styles.activeClassButton]}
    onPress={onPress}>
    <Text style={[styles.classButtonText, active && styles.activeClassButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// 成绩分布条组件
const ScoreBar = ({ label, count, percentage, color }) => (
  <View style={styles.scoreBarContainer}>
    <View style={styles.scoreBarHeader}>
      <Text style={styles.scoreBarLabel}>{label}</Text>
      <Text style={styles.scoreBarCount}>{count}人</Text>
    </View>
    <View style={styles.scoreBar}>
      <View
        style={[styles.scoreBarFill, { width: `${percentage}%`, backgroundColor: color }]}
      />
    </View>
    <Text style={styles.scoreBarPercentage}>{percentage}%</Text>
  </View>
);

const StatsScreen = () => {
  const [activeClass, setActiveClass] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f0f9ff', '#e0eafc']}
        style={styles.background}
      >
        {/* 顶部导航 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>数据统计</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="calendar" size={20} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="download" size={20} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 班级选择 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.classScrollView}
          contentContainerStyle={styles.classButtonContainer}
        >
          <ClassButton
            label="全部班级"
            active={activeClass === 'all'}
            onPress={() => setActiveClass('all')}
          />
          <ClassButton
            label="高一(2)班"
            active={activeClass === 'class1'}
            onPress={() => setActiveClass('class1')}
          />
          <ClassButton
            label="高二(3)班"
            active={activeClass === 'class2'}
            onPress={() => setActiveClass('class2')}
          />
          <ClassButton
            label="高三(1)班"
            active={activeClass === 'class3'}
            onPress={() => setActiveClass('class3')}
          />
        </ScrollView>

        <ScrollView style={styles.scrollView}>
          {/* 统计卡片 */}
          <View style={styles.statCardsContainer}>
            <StatCard
              title="总学生数"
              value="156"
              bgColor="#dbeafe"
            />
            <StatCard
              title="平均分"
              value="86.5"
              change="+2.3"
              changeType="up"
              bgColor="#dcfce7"
            />
            <StatCard
              title="及格率"
              value="92%"
              change="+5%"
              changeType="up"
              bgColor="#fef3c7"
            />
            <StatCard
              title="优秀率"
              value="45%"
              change="-3%"
              changeType="down"
              bgColor="#fee2e2"
            />
          </View>

          {/* 成绩分布 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>成绩分布</Text>
              <Text style={styles.sectionSubtitle}>最近一次考试</Text>
            </View>

            <View style={styles.scoreDistribution}>
              <ScoreBar
                label="优秀 (90-100)"
                count={32}
                percentage={21}
                color="#10b981"
              />
              <ScoreBar
                label="良好 (80-89)"
                count={56}
                percentage={36}
                color="#0ea5e9"
              />
              <ScoreBar
                label="中等 (70-79)"
                count={42}
                percentage={27}
                color="#f59e0b"
              />
              <ScoreBar
                label="及格 (60-69)"
                count={18}
                percentage={12}
                color="#f97316"
              />
              <ScoreBar
                label="不及格 (0-59)"
                count={8}
                percentage={5}
                color="#ef4444"
              />
            </View>
          </View>

          {/* 班级对比 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>班级对比</Text>
              <Text style={styles.sectionSubtitle}>数学学科</Text>
            </View>

            <View style={styles.classComparisonCard}>
              <View style={styles.classComparisonItem}>
                <View style={styles.classComparisonHeader}>
                  <Text style={styles.classComparisonName}>高一(2)班</Text>
                  <Text style={styles.classComparisonValue}>85.6</Text>
                </View>
                <View style={styles.classComparisonBar}>
                  <View
                    style={[styles.classComparisonFill, { width: '86%', backgroundColor: '#0ea5e9' }]}
                  />
                </View>
              </View>

              <View style={styles.classComparisonItem}>
                <View style={styles.classComparisonHeader}>
                  <Text style={styles.classComparisonName}>高二(3)班</Text>
                  <Text style={styles.classComparisonValue}>82.3</Text>
                </View>
                <View style={styles.classComparisonBar}>
                  <View
                    style={[styles.classComparisonFill, { width: '82%', backgroundColor: '#f59e0b' }]}
                  />
                </View>
              </View>

              <View style={styles.classComparisonItem}>
                <View style={styles.classComparisonHeader}>
                  <Text style={styles.classComparisonName}>高三(1)班</Text>
                  <Text style={styles.classComparisonValue}>89.7</Text>
                </View>
                <View style={styles.classComparisonBar}>
                  <View
                    style={[styles.classComparisonFill, { width: '90%', backgroundColor: '#10b981' }]}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: (STATUS_BAR_HEIGHT + 30) / 2,
    height: STATUS_BAR_HEIGHT + 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  classScrollView: {
    paddingHorizontal: 16,
  },
  classButtonContainer: {
    paddingVertical: 8,
    gap: 8,
  },
  classButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  activeClassButton: {
    backgroundColor: '#0ea5e9',
  },
  classButtonText: {
    fontSize: 12,
    color: '#4b5563',
  },
  activeClassButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  statCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statCardChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statCardChangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreDistribution: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    gap: 12,
  },
  scoreBarContainer: {
    gap: 4,
  },
  scoreBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreBarLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  scoreBarCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreBarPercentage: {
    fontSize: 10,
    color: '#6b7280',
    alignSelf: 'flex-end',
  },
  classComparisonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    gap: 16,
  },
  classComparisonItem: {
    gap: 4,
  },
  classComparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classComparisonName: {
    fontSize: 12,
    color: '#4b5563',
  },
  classComparisonValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  classComparisonBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  classComparisonFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default StatsScreen;
