// 分析卡片组件

import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {chartIcon, homeIcon} from '../../assets/icons';
import Icon from '../common/Icon';
import {SUBJECT_COLORS} from './TaskCard';

export const AnalysisCard = ({
  title,
  subtitle,
  averageScore,
  fullScore,
  correctRate,
  correctNumber,
  wrongNumber,
  excellentRate,
  subject,
  onPress,
}) => (
  <View style={styles.analysisCard}>
    <TouchableOpacity onPress={onPress}>
      {/* 卡片头部 */}
      <View style={styles.analysisCardHeaderNew}>
        <View
          style={[
            styles.analysisCardIcon,
            {backgroundColor: SUBJECT_COLORS[subject] || '#dbeafe'},
          ]}>
          <Icon name={subject} size={24} />
        </View>
        <View>
          <Text style={styles.analysisCardTitle}>{title}</Text>
          {/* <Text style={styles.analysisCardSubtitle}>{subtitle}</Text> */}
        </View>
      </View>

      {/* 平均分进度条 */}
      <View style={styles.analysisCardProgressContainer}>
        <View style={styles.analysisCardProgressHeader}>
          <Text style={styles.analysisCardProgressLabel}>得分</Text>
          <Text style={styles.analysisCardProgressValue}>{averageScore}</Text>
        </View>
        <View style={styles.analysisCardProgressBar}>
          <View
            style={[
              styles.analysisCardProgressFill,
              {width: `${Math.min((averageScore / fullScore) * 100, 100)}%`},
            ]}
          />
        </View>
      </View>

      {/* 统计数据 */}
      <View style={styles.analysisCardStats}>
        <View style={styles.analysisCardStatItem}>
          <Text style={styles.analysisCardStatValue}>{correctRate}%</Text>
          <Text style={styles.analysisCardStatLabel}>正确率</Text>
        </View>
        <View style={styles.analysisCardStatItem}>
          <Text style={[styles.analysisCardStatValue, styles.correctNumber]}>
            {correctNumber}
          </Text>
          <Text style={[styles.analysisCardStatLabel, styles.correctNumber]}>
            答对题目
          </Text>
        </View>
        <View style={styles.analysisCardStatItem}>
          <Text style={[styles.analysisCardStatValue, styles.wrongNumber]}>
            {wrongNumber}
          </Text>
          <Text style={[styles.analysisCardStatLabel, styles.wrongNumber]}>
            错误题目
          </Text>
        </View>
        {/* <View style={styles.analysisCardStatItem}>
        <Text style={styles.analysisCardStatValue}>{excellentRate}</Text>
        <Text style={styles.analysisCardStatLabel}>优秀率</Text>
      </View> */}
      </View>
    </TouchableOpacity>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
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
  correctNumber: {
    color: '#008000',
  },
  wrongNumber: {
    color: '#ff1a1c',
  },
});
