/**
 * Toast提示工具函数
 * 提供统一的Toast提示接口，替代Alert.alert
 */

import Toast from 'react-native-toast-message';

/**
 * 显示成功提示
 * @param message 提示消息
 * @param description 详细描述（可选）
 */
export const showSuccess = (message: string, description?: string) => {
  Toast.show({
    type: 'success',
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 2000,
  });
};

/**
 * 显示错误提示
 * @param message 提示消息
 * @param description 详细描述（可选）
 */
export const showError = (message: string, description?: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 3000,
  });
};

/**
 * 显示信息提示
 * @param message 提示消息
 * @param description 详细描述（可选）
 */
export const showInfo = (message: string, description?: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 2500,
  });
};

/**
 * 显示确认提示（替代Alert.alert的确认对话框）
 * 注意：由于Toast不支持确认对话框，此函数仅显示提示信息
 * 对于需要用户确认的操作，仍需使用Alert.alert
 * @param message 提示消息
 * @param description 详细描述（可选）
 */
export const showConfirm = (message: string, description?: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 3000,
  });
};
