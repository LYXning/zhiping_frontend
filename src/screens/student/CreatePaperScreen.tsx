/**
 * 学生端交卷组件
 * 用于学生提交作业或试卷
 */

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {submitPaper, clearPaperErrors} from '../../store/actions/paperActions';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  PermissionsAndroid,
  Platform,
  LogBox,
  Alert,
} from 'react-native';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// 导入图标资源
import {
  fileIcon,
  bookIcon,
  plusIcon,
  homeIcon,
  cameraIcon,
  uploadIcon,
  rightIcon,
  sparklesIcon,
  helpCircleIcon,
  leftIcon,
} from '../../assets/icons';
import {subjectsArray} from '../../utils/subjectUtils';

// 忽略 CameraView 事件命名约定警告
LogBox.ignoreLogs([
  "Direct event name for 'CameraView' doesn't correspond to the naming convention",
]);

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '需要相机权限',
          message: '需要访问您的相机以拍摄照片上传试卷',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '确定',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('相机权限已授予');
        return true;
      } else {
        console.log('相机权限被拒绝');
        Alert.alert('权限被拒绝', '无法使用相机功能，请在设置中开启相机权限');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

// 图标组件
const Icon = ({name, size = 24, color = '#000'}) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = iconName => {
    switch (iconName) {
      case 'arrow-left':
        return leftIcon;
      case 'help-circle':
        return helpCircleIcon;
      case 'file-text':
        return fileIcon;
      case 'book-open':
        return bookIcon;
      case 'upload-cloud':
        return uploadIcon;
      case 'chevron-right':
        return rightIcon;
      case 'plus':
        return plusIcon;
      case 'sparkles':
        return sparklesIcon;
      case 'camera':
        return cameraIcon;
      case 'file':
        return fileIcon;
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

/**
 * 学生端交卷屏幕组件
 */
const CreatePaperScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const taskId = route.params?.taskId || '';
  const taskName = route.params?.taskName || '未命名任务';

  // 状态管理
  const [paperTitle, setPaperTitle] = useState(taskName || '');
  const [subject, setSubject] = useState('政治');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPreviewImage, setCurrentPreviewImage] = useState(null);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);

  // 科目列表
  const subjects = subjectsArray;

  // 处理科目选择
  const handleSubjectSelect = selectedSubject => {
    setSubject(selectedSubject);
    setSubjectModalVisible(false);
  };

  // Redux
  const dispatch = useDispatch();
  const {loading, error, success} = {
    loading: false,
    error: null,
    success: false,
  };
  //   useSelector(
  //     (state: RootState) => state.paper,
  //   );

  // 清除错误
  useEffect(() => {
    return () => {
      dispatch(clearPaperErrors());
    };
  }, [dispatch]);

  // 处理返回按钮点击
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 处理拍照上传
  const handleCameraUpload = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
      selectionLimit: 0, // 0表示不限制数量
      includeBase64: false,
    };

    console.log('启动原生相机');

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('用户取消了拍照');
      } else if (response.errorCode) {
        console.log('相机错误: ', response.errorMessage);
        Alert.alert('错误', '拍照出错: ' + response.errorMessage);
      } else {
        // 处理拍照成功的情况
        if (response.assets && response.assets.length > 0) {
          const newImages = [...uploadedImages, ...response.assets];
          setUploadedImages(newImages);

          // 这里可以添加上传到服务器的逻辑
          Alert.alert('成功', '照片已拍摄，准备上传');
        }
      }
    });
  };

  // 处理选择图片上传
  const handleFileUpload = () => {
    const options = {
      mediaType: 'mixed',
      quality: 0.8,
      selectionLimit: 0, // 0表示不限制数量
      multiple: true, // 允许多选
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('用户取消了选择');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('错误', '选择文件出错: ' + response.errorMessage);
      } else {
        // 处理选择成功的情况
        if (response.assets && response.assets.length > 0) {
          const newImages = [...uploadedImages, ...response.assets];
          setUploadedImages(newImages);

          // 这里可以添加上传到服务器的逻辑
          Alert.alert(
            '成功',
            `已选择${response.assets.length}个文件，准备上传`,
          );
        }
      }
    });
  };

  const handlePreviewImage = image => {
    setCurrentPreviewImage(image);
    setPreviewVisible(true);
  };

  // 关闭图片预览
  const handleClosePreview = () => {
    setPreviewVisible(false);
    setCurrentPreviewImage(null);
  };

  // 处理提交试卷
  const handleSubmitPaper = () => {
    // 验证必填字段
    if (uploadedImages.length === 0) {
      Alert.alert('提示', '请上传至少一张试卷图片');
      return;
    }

    if (!paperTitle.trim()) {
      Alert.alert('提示', '请填写作业标题');
      return;
    }

    // 设置提交状态
    setIsSubmitting(true);

    // 准备提交数据
    const submitData = {
      taskId: taskId,
      paperTitle: paperTitle.trim(),
      subject: subject,
      autoCheck: autoCheckEnabled,
      notification: notificationEnabled,
    };

    console.log('准备提交:', {
      submitData,
      imageCount: uploadedImages.length,
      firstImageUri: uploadedImages[0]?.uri,
    });

    // 提交试卷
    dispatch(submitPaper(submitData, uploadedImages))
      .then(() => {
        // 提交成功后返回上一页
        Alert.alert('成功', '试卷已提交', [
          {text: '确定', onPress: () => navigation.goBack()},
        ]);
      })
      .catch(err => {
        console.error('提交失败:', err);
        setIsSubmitting(false);
        Alert.alert('错误', '提交失败，请重试');
      });
  };

  // 设置项组件
  const SettingItem = ({title, value, onChange}) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{false: '#d1d5db', true: '#0ea5e9'}}
        thumbColor="#ffffff"
        ios_backgroundColor="#d1d5db"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#4b5563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>提交作业</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Icon name="help-circle" size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        {/* 图片预览模态框 */}
        {previewVisible && (
          <View style={styles.previewContainer}>
            <TouchableOpacity
              style={styles.previewCloseButton}
              onPress={() => setPreviewVisible(false)}>
              <Text style={styles.previewCloseText}>×</Text>
            </TouchableOpacity>
            <View style={styles.previewImageContainer}>
              <Image
                source={{uri: currentPreviewImage?.uri}}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.previewFileName}>
              {currentPreviewImage?.fileName || '图片预览'}
            </Text>
          </View>
        )}

        {/* 科目选择模态框 */}
        {subjectModalVisible && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>选择科目</Text>
              <ScrollView style={styles.modalScrollView}>
                {subjects.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.subjectItem,
                      subject === item && styles.subjectItemSelected,
                    ]}
                    onPress={() => handleSubjectSelect(item)}>
                    <Text
                      style={[
                        styles.subjectItemText,
                        subject === item && styles.subjectItemTextSelected,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSubjectModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView style={styles.scrollView}>
          {/* 基本信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>基本信息</Text>

            {/* 任务名称 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>作业标题</Text>
              <TextInput
                style={styles.textInput}
                placeholder="请输入作业标题"
                value={paperTitle}
                onChangeText={setPaperTitle}
              />
            </View>

            {/* 科目 */}
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setSubjectModalVisible(true)}>
              <Text style={styles.inputLabel}>科目</Text>
              <View style={styles.subjectSelector}>
                <Text style={styles.taskNameText}>{subject}</Text>
                <Icon name="chevron-right" size={16} color="#6b7280" />
              </View>
            </TouchableOpacity>
          </View>

          {/* 上传内容 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>上传内容</Text>

            {/* 上传试卷 */}
            <View style={styles.inputContainer}>
              <View style={styles.rowBetween}>
                <Text style={styles.inputLabel}>上传试卷</Text>
                <TouchableOpacity>
                  <Text style={styles.actionText}>查看示例</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.uploadOptionsContainer}>
                <TouchableOpacity
                  style={styles.uploadOptionButton}
                  onPress={handleCameraUpload}>
                  <View style={styles.uploadOptionIconContainer}>
                    <Icon name="camera" size={24} color="#0284c7" />
                  </View>
                  <Text style={styles.uploadOptionText}>拍照上传</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadOptionButton}
                  onPress={handleFileUpload}>
                  <View style={styles.uploadOptionIconContainer}>
                    <Icon name="upload" size={24} color="#0284c7" />
                  </View>
                  <Text style={styles.uploadOptionText}>文件上传</Text>
                </TouchableOpacity>
              </View>

              {/* 显示已上传的图片/文件 */}
              {uploadedImages.length > 0 && (
                <View style={styles.uploadedFilesContainer}>
                  <View style={styles.uploadedFilesHeader}>
                    <Text style={styles.uploadedFilesTitle}>
                      已上传文件 ({uploadedImages.length})
                    </Text>
                    <TouchableOpacity onPress={() => setUploadedImages([])}>
                      <Text style={styles.clearAllText}>清空</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.uploadedFilesScroll}>
                    {uploadedImages.map((image, index) => (
                      <View key={index} style={styles.uploadedFileItem}>
                        {image.uri && (
                          <TouchableOpacity
                            onPress={() => handlePreviewImage(image)}>
                            <Image
                              source={{uri: image.uri}}
                              style={styles.uploadedFileThumb}
                            />
                          </TouchableOpacity>
                        )}
                        <Text
                          style={styles.uploadedFileName}
                          numberOfLines={1}
                          ellipsizeMode="middle">
                          {image.fileName || `照片 ${index + 1}`}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeFileButton}
                          onPress={() => {
                            const newImages = [...uploadedImages];
                            newImages.splice(index, 1);
                            setUploadedImages(newImages);
                          }}>
                          <Text style={styles.removeFileText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {/* 提交设置 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>提交设置</Text>

            <View style={styles.settingsContainer}>
              <SettingItem
                title="AI自动批改"
                value={autoCheckEnabled}
                onChange={setAutoCheckEnabled}
              />

              <SettingItem
                title="批改完成通知"
                value={notificationEnabled}
                onChange={setNotificationEnabled}
              />
            </View>
          </View>

          {/* 底部间距 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* 底部工具栏 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitPaper}
            disabled={isSubmitting}>
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '提交中...' : '提交作业'}
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: STATUS_BAR_HEIGHT + 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
  },
  helpButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  textInput: {
    fontSize: 14,
    color: '#1f2937',
    padding: 0,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  taskNameText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#0284c7',
  },
  uploadOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  uploadOptionButton: {
    alignItems: 'center',
    padding: 12,
  },
  uploadOptionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadOptionText: {
    fontSize: 12,
    color: '#0284c7',
  },
  uploadedFilesContainer: {
    marginTop: 16,
  },
  uploadedFilesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadedFilesTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  clearAllText: {
    fontSize: 12,
    color: '#ef4444',
  },
  uploadedFilesScroll: {
    flexDirection: 'row',
  },
  uploadedFileItem: {
    width: 80,
    marginRight: 12,
    position: 'relative',
  },
  uploadedFileThumb: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
  uploadedFileName: {
    fontSize: 10,
    color: '#4b5563',
    marginTop: 4,
    textAlign: 'center',
  },
  removeFileButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeFileText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  previewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  previewCloseText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  previewImageContainer: {
    width: '90%',
    height: '70%',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewFileName: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 16,
  },
  settingsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingTitle: {
    fontSize: 14,
    color: '#1f2937',
  },
  bottomSpacer: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  submitButton: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  // 科目选择器样式
  subjectSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // 模态框样式
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  subjectItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  subjectItemSelected: {
    backgroundColor: '#e0f2fe',
  },
  subjectItemText: {
    fontSize: 14,
    color: '#1f2937',
  },
  subjectItemTextSelected: {
    color: '#0284c7',
    fontWeight: '500',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
});

export default CreatePaperScreen;
