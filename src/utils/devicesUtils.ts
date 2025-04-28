/**
 * 设备工具函数
 * 提供获取设备尺寸、状态栏高度等功能
 */

import {Dimensions, Platform, StatusBar} from 'react-native';

// 获取屏幕宽度
export const SCREEN_WIDTH = Dimensions.get('window').width;

// 获取屏幕高度
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// 获取状态栏高度
export const STATUS_BAR_HEIGHT = Platform.select({
  ios: Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : 0,
  android: StatusBar.currentHeight || 24, // 使用默认值24，而不是0
  default: 24,
});

/**
 * 判断是否为iPhone X或更新的机型（带刘海的iPhone）
 * @returns {boolean} 是否为iPhone X或更新机型
 */
export function isIphoneX() {
  const {height, width} = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (height === 780 ||
      width === 780 ||
      height === 812 ||
      width === 812 ||
      height === 844 ||
      width === 844 ||
      height === 896 ||
      width === 896 ||
      height === 926 ||
      width === 926)
  );
}

/**
 * 获取底部安全区域高度（主要用于iPhone X及以上机型）
 * @returns {number} 底部安全区域高度
 */
export const BOTTOM_SAFE_AREA_HEIGHT = Platform.select({
  ios: isIphoneX() ? 60 : 36,
  default: 36,
});

/**
 * 获取设备是否为平板
 * @returns {boolean} 是否为平板设备
 */
export const IS_TABLET =
  SCREEN_HEIGHT / SCREEN_WIDTH < 1.6 &&
  (Platform.isPad || (Platform.OS === 'android' && SCREEN_WIDTH > 600));

/**
 * 根据设备尺寸进行响应式计算
 * @param {number} size - 基准尺寸
 * @returns {number} 根据屏幕宽度计算后的尺寸
 */
export function responsiveSize(size: number): number {
  const baseWidth = 375; // 基准宽度（iPhone 6/7/8）
  const scale = SCREEN_WIDTH / baseWidth;
  return Math.round(size * scale);
}

/**
 * 获取适合当前设备的容器样式，包含状态栏高度
 * @param {boolean} includeStatusBar - 是否包含状态栏高度
 * @returns {Object} 样式对象
 */
export function getContainerStyle(includeStatusBar = true) {
  return {
    paddingTop: includeStatusBar ? STATUS_BAR_HEIGHT : 0,
  };
}
