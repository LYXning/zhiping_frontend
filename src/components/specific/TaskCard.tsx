import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from '../common/Icon';

export const SUBJECT_COLORS = {
  math: '#e3f2fd',
  chinese: '#f1f8e9',
  english: '#fff8e1',
  physics: '#fff3e0',
  chemistry: '#e8f5e9',
  biology: '#e0f7fa',
  history: '#f3e5f5',
  geography: '#e8eaf6',
  politics: '#fce4ec',
  default: '#f5f5f5',
};

const STATUS_COLORS: Record<number, {bg: string; text: string}> = {
  1: {
    bg: '#e3f2fd',
    text: '#1976d2',
  },
  2: {
    bg: '#f5f5f5',
    text: '#757575',
  },
  3: {
    bg: '#fff8e1',
    text: '#f57c00',
  },
  4: {
    bg: '#e8f5e9',
    text: '#388e3c',
  },
  5: {
    bg: '#e0f2fe',
    text: '#0284c7',
  },
};

const STATE_TEXT: Record<number, string> = {
  1: '已发布',
  2: '草稿',
  3: '待批改',
  4: '批改中',
  5: '已完成',
};

// 新增按钮样式常量
const BUTTON_STYLES: Record<number, {bg: string; text: string; label: string}> =
  {
    1: {
      bg: '#1976d2',
      text: '#ffffff',
      label: '提交试卷',
    },
    2: {
      bg: '#4b5563',
      text: '#ffffff',
      label: '编辑试卷',
    },
    3: {
      bg: '#0ea5e9',
      text: '#ffffff',
      label: '提交批改',
    },
    4: {
      bg: '#10b981', // 修改为绿色系
      text: '#ffffff', // 修改为白色
      label: '查看批改',
    },
    5: {
      bg: '#ffffff',
      text: '#4b5563',
      label: '查看结果',
    },
  };

// 修改 taskProps 接口，确保 status 类型与 STATUS_COLORS 的键匹配
interface taskProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  id: number;
  title: string;
  subtitle: string;
  status: number;
  deadline: string;
  showActionButton?: boolean;
}

export const TaskCard = ({
  icon,
  iconBg,
  iconColor,
  id,
  title,
  subtitle,
  status,
  deadline,
}) => {
  console.log('TaskCard rendered ' + icon);
  const navigation = useNavigation();

  const statusText = STATE_TEXT[status];
  const statusBg = STATUS_COLORS[status].bg;
  const statusColor = STATUS_COLORS[status].text;

  // 获取按钮样式
  const buttonStyle = BUTTON_STYLES[status] || BUTTON_STYLES[3];

  const showActionButton =
    status === 1 || status === 3 || status === 4 || status === 5;
  const handlePress = () => {
    switch (status) {
      case 1:
        navigation.navigate('Student', {
          screen: 'CreatePaper',
          params: {
            paperId: id,
            paperName: title,
            paperSubject: icon,
          },
        });
        break;
      case 3:
        navigation.navigate('Student', {
          screen: 'PaperReview',
          params: {
            paperId: id,
            paperName: title,
          },
        });
        break;
      case 4:
      case 5:
        navigation.navigate('Student', {
          screen: 'PaperReport',
          params: {
            paperId: id,
            paperName: title,
          },
        });
        break;
    }
  };

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskCardHeader}>
        <View style={styles.taskCardTitleContainer}>
          <View
            style={[
              styles.taskCardIcon,
              {backgroundColor: SUBJECT_COLORS[icon] || '#f5f5f5'},
            ]}>
            <Icon name={icon} size={26} />
          </View>
          <View>
            <Text style={styles.taskCardTitle}>{title}</Text>
            {/* <Text style={styles.taskCardSubtitle}>{subtitle}</Text> */}
          </View>
        </View>
        <View style={[styles.taskCardStatus, {backgroundColor: statusBg}]}>
          <Text style={[styles.taskCardStatusText, {color: statusColor}]}>
            {statusText}
          </Text>
        </View>
      </View>
      <View style={styles.taskCardFooter}>
        <Text style={styles.taskCardDeadline}>{deadline}</Text>
        {showActionButton && (
          <TouchableOpacity
            style={[styles.taskCardButton, {backgroundColor: buttonStyle.bg}]}
            onPress={handlePress}>
            <Text
              style={[styles.taskCardButtonText, {color: buttonStyle.text}]}>
              {buttonStyle.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  taskCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  taskCardStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskCardStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskCardDeadline: {
    fontSize: 12,
    color: '#6b7280',
  },
  taskCardButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  taskCardButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
