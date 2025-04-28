import React from 'react';
import {Image, ImageStyle} from 'react-native';
import {
  userIcon,
  lockIcon,
  smartphoneIcon,
  messageSquareIcon,
  checkCircleIcon,
  idCardIcon,
  buildingIcon,
  settingsIcon,
  trashIcon,
  wechatIcon,
  mailIcon,
  homeIcon,
  plusIcon,
  searchIcon,
  filterIcon,
  scanIcon,
  helpCircleIcon,
  fileIcon,
  fileCheckIcon,
  bookIcon,
  messageCircleIcon,
  clockIcon,
  calendarIcon,
  chartIcon,
  trendingUpIcon,
  downloadIcon,
  uploadIcon,
  rightIcon,
  leftIcon,
  cameraIcon,
  sparklesIcon,
  checkIcon,
  editIcon,
  deleteIcon,
  clipboardListIcon,
  zapIcon,
  bellIcon,
  clipboardCheckIcon,
  emptyBoxIcon,
  saveIcon,
  listIcon,
  // 学科相关图标
  chineseIcon,
  mathIcon,
  englishIcon,
  physicsIcon,
  chemistryIcon,
  biologyIcon,
  historyIcon,
  geographyIcon,
  politicsIcon,
  wrongCircleIcon,
  resultIcon,
} from '../../assets/icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ImageStyle;
}

const Icon: React.FC<IconProps> = ({name, size = 24, color, style}) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = (iconName: string) => {
    switch (iconName) {
      // 用户相关图标
      case 'user':
        return userIcon;
      case 'lock':
        return lockIcon;
      case 'smartphone':
        return smartphoneIcon;
      case 'message-square':
        return messageSquareIcon;
      case 'check-circle':
        return checkCircleIcon;
      case 'wrong-circle':
        return wrongCircleIcon;
      case 'id-card':
        return idCardIcon;
      case 'building':
        return buildingIcon;
      case 'settings':
        return settingsIcon;
      case 'trash':
        return trashIcon;

      // 社交登录图标
      case 'wechat':
        return wechatIcon;
      case 'mail':
        return mailIcon;

      // 导航和操作图标
      case 'home':
        return homeIcon;
      case 'plus':
        return plusIcon;
      case 'search':
        return searchIcon;
      case 'filter':
        return filterIcon;
      case 'scan':
        return scanIcon;
      case 'help-circle':
        return helpCircleIcon;

      // 文件和内容图标
      case 'file':
        return fileIcon;
      case 'file-check':
        return fileCheckIcon;
      case 'book':
        return bookIcon;

      // 消息和通知图标
      case 'message-circle':
        return messageCircleIcon;

      // 时间和日期图标
      case 'clock':
        return clockIcon;
      case 'calendar':
        return calendarIcon;

      // 数据和统计图标
      case 'chart':
        return chartIcon;
      case 'trending-up':
        return trendingUpIcon;
      case 'download':
        return downloadIcon;
      case 'upload':
        return uploadIcon;
      case 'result':
        return resultIcon;
      // 方向图标
      case 'chevron-right':
        return rightIcon;
      case 'arrow-left':
        return leftIcon;

      // 设备相关
      case 'camera':
        return cameraIcon;

      // 通用操作图标
      case 'sparkles':
        return sparklesIcon;
      case 'check':
        return checkIcon;
      case 'edit':
        return editIcon;
      case 'delete':
        return deleteIcon;
      case 'clipboard-list':
        return clipboardListIcon;
      case 'zap':
        return zapIcon;
      case 'bell':
        return bellIcon;
      case 'clipboard-check':
        return clipboardCheckIcon;
      case 'empty-box':
        return emptyBoxIcon;
      case 'save':
        return saveIcon;
      case 'list':
        return listIcon;

      // 学科相关图标
      case 'chinese':
        return chineseIcon;
      case 'math':
        return mathIcon;
      case 'english':
        return englishIcon;
      case 'physics':
        return physicsIcon;
      case 'chemistry':
        return chemistryIcon;
      case 'biology':
        return biologyIcon;
      case 'history':
        return historyIcon;
      case 'geography':
        return geographyIcon;
      case 'politics':
        return politicsIcon;

      default:
        return leftIcon; // 默认返回左箭头图标
    }
  };

  return (
    <Image
      source={getIconSource(name)}
      style={[{width: size, height: size, tintColor: color}, style]}
    />
  );
};

export default Icon;
