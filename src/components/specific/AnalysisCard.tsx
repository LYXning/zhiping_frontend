// 分析卡片组件

import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {chartIcon, homeIcon} from '../../assets/icons';

// 图标组件
const Icon = ({name, size = 24, color = '#000'}) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = iconName => {
    switch (iconName) {
      case 'chart':
        return chartIcon;
      default:
        return homeIcon;
    }
  };
  return (
    <Image
      source={getIconSource(name)}
      style={{width: size, height: size, tintColor: color}}
    />
  );
};

export const AnalysisCard = ({
  title,
  subtitle,
  averageScore,
  maxScore,
  minScore,
  passRate,
  excellentRate,
}) => (
  <View style={styles.analysisCard}>
    {/* 卡片头部 */}
    <View style={styles.analysisCardHeaderNew}>
      <View style={styles.analysisCardIcon}>
        <Icon name="bar-chart-2" size={24} color="#0284c7" />
      </View>
      <View>
        <Text style={styles.analysisCardTitle}>{title}</Text>
        <Text style={styles.analysisCardSubtitle}>{subtitle}</Text>
      </View>
    </View>

    {/* 平均分进度条 */}
    <View style={styles.analysisCardProgressContainer}>
      <View style={styles.analysisCardProgressHeader}>
        <Text style={styles.analysisCardProgressLabel}>班级平均分</Text>
        <Text style={styles.analysisCardProgressValue}>{averageScore}</Text>
      </View>
      <View style={styles.analysisCardProgressBar}>
        <View
          style={[
            styles.analysisCardProgressFill,
            {width: `${Math.min(averageScore, 100)}%`},
          ]}
        />
      </View>
    </View>

    {/* 统计数据 */}
    <View style={styles.analysisCardStats}>
      <View style={styles.analysisCardStatItem}>
        <Text style={styles.analysisCardStatValue}>{maxScore}</Text>
        <Text style={styles.analysisCardStatLabel}>最高分</Text>
      </View>
      <View style={styles.analysisCardStatItem}>
        <Text style={styles.analysisCardStatValue}>{minScore}</Text>
        <Text style={styles.analysisCardStatLabel}>最低分</Text>
      </View>
      <View style={styles.analysisCardStatItem}>
        <Text style={styles.analysisCardStatValue}>{passRate}</Text>
        <Text style={styles.analysisCardStatLabel}>及格率</Text>
      </View>
      <View style={styles.analysisCardStatItem}>
        <Text style={styles.analysisCardStatValue}>{excellentRate}</Text>
        <Text style={styles.analysisCardStatLabel}>优秀率</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  analysisScrollView: {
    marginHorizontal: -4,
  },
  analysisCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    width: 280,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  analysisCardHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  analysisCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  analysisCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  analysisCardProgressContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  analysisCardProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisCardProgressLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  analysisCardProgressValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0284c7',
  },
  analysisCardProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  analysisCardProgressFill: {
    height: '100%',
    backgroundColor: '#0284c7',
    borderRadius: 4,
  },
  analysisCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analysisCardStatItem: {
    alignItems: 'center',
  },
  analysisCardStatValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  analysisCardStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
});
