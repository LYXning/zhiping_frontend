/**
 * 教师端创建任务组件
 * 用于创建新的批改任务，包括试卷批改和作业批改
 */

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {
  saveDraft,
  publishTask,
  clearTaskErrors,
} from '../../store/actions/taskActions';
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
} from 'react-native';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Alert} from 'react-native';
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
        return sparklesIcon; // 临时替代
      case 'camera':
        return cameraIcon; // 临时替代
      case 'file':
        return fileIcon; // 临时替代
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

// 任务类型选择项组件
const TaskTypeItem = ({icon, title, subtitle, isSelected, onPress}) => (
  <TouchableOpacity
    style={[
      styles.taskTypeItem,
      isSelected ? styles.taskTypeItemSelected : styles.taskTypeItemNormal,
    ]}
    onPress={onPress}
    activeOpacity={0.7}>
    <View
      style={[
        styles.taskTypeIcon,
        {backgroundColor: isSelected ? '#e0f2fe' : '#f3f4f6'},
      ]}>
      <Icon name={icon} size={20} color={isSelected ? '#0284c7' : '#6b7280'} />
    </View>
    <View>
      <Text style={styles.taskTypeTitle}>{title}</Text>
      <Text style={styles.taskTypeSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

// 科目标签组件
const SubjectTag = ({label, isSelected, onPress}) => (
  <TouchableOpacity
    style={[
      styles.subjectTag,
      isSelected ? styles.subjectTagSelected : styles.subjectTagNormal,
    ]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text
      style={[
        styles.subjectTagText,
        isSelected
          ? styles.subjectTagTextSelected
          : styles.subjectTagTextNormal,
      ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// 班级标签组件
const ClassTag = ({label, isSelected, onPress}) => (
  <TouchableOpacity
    style={[
      styles.classTag,
      isSelected ? styles.classTagSelected : styles.classTagNormal,
    ]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text
      style={[
        styles.classTagText,
        isSelected ? styles.classTagTextSelected : styles.classTagTextNormal,
      ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// 试卷结构项组件
const ExamStructureItemComponent = ({index, title, count, score, onPress}) => (
  <TouchableOpacity style={styles.examStructureItem} onPress={onPress}>
    <View style={styles.examStructureLeft}>
      <View style={styles.examStructureIndex}>
        <Text style={styles.examStructureIndexText}>{index}</Text>
      </View>
      <Text style={styles.examStructureTitle}>{title}</Text>
    </View>
    <View style={styles.examStructureRight}>
      <Text style={styles.examStructureInfo}>{count}题</Text>
      <Text style={styles.examStructureDivider}>|</Text>
      <Text style={styles.examStructureInfo}>{score}</Text>
      <Icon name="chevron-right" size={16} color="#9ca3af" />
    </View>
  </TouchableOpacity>
);

// AI建议项组件
const AISuggestionItem = ({index, content}) => (
  <View style={styles.aiSuggestionItem}>
    <View style={styles.aiSuggestionIndex}>
      <Text style={styles.aiSuggestionIndexText}>{index}</Text>
    </View>
    <Text style={styles.aiSuggestionContent}>{content}</Text>
  </View>
);

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

// 优先级滑块组件
const PrioritySlider = ({value, onChange}) => (
  <View style={styles.prioritySlider}>
    <View style={styles.prioritySliderHeader}>
      <Text style={styles.settingTitle}>批改优先级</Text>
      <Text style={styles.priorityValue}>
        {value === 0 ? '低' : value === 50 ? '标准' : '高'}
      </Text>
    </View>
    <View style={styles.sliderTrack}>
      <View style={[styles.sliderFill, {width: `${value}%`}]} />
    </View>
    <View style={styles.sliderLabels}>
      <Text style={styles.sliderLabel}>低</Text>
      <Text style={styles.sliderLabel}>高</Text>
    </View>
  </View>
);

/**
 * 创建任务屏幕组件
 */
const CreateTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 状态管理
  const [taskType, setTaskType] = useState('exam'); // 'exam' 或 'homework'
  const [taskName, setTaskName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('数学');
  const [selectedClasses, setSelectedClasses] = useState([
    '高二(3)班',
    '高二(5)班',
  ]);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [aiRecognitionEnabled, setAiRecognitionEnabled] = useState(true);
  const [autoGradingEnabled, setAutoGradingEnabled] = useState(true);
  const [teacherReviewEnabled, setTeacherReviewEnabled] = useState(true);
  const [publishResultsEnabled, setPublishResultsEnabled] = useState(false);
  const [priority, setPriority] = useState(50);
  const [taskNotificationEnabled, setTaskNotificationEnabled] = useState(true);
  const [deadlineReminderEnabled, setDeadlineReminderEnabled] = useState(true);
  const [
    gradingCompleteNotificationEnabled,
    setGradingCompleteNotificationEnabled,
  ] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollViewRef = React.useRef(null);
  const [examStructureSectionY, setExamStructureSectionY] = useState(0);

  // 添加试卷结构相关状态
  const [examStructure, setExamStructure] = useState([]);

  // 添加图片预览相关状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPreviewImage, setCurrentPreviewImage] = useState(null);

  // 科目列表
  const subjects = ['数学', '语文', '英语', '物理', '化学', '生物'];

  // AI建议
  const [aiSuggestions, setAiSuggestions] = useState([]);

  // 添加相机状态
  const [cameraVisible, setCameraVisible] = useState(false);

  // 处理从ExamContentScreen传递过来的数据
  useEffect(() => {
    if (route.params) {
      const {
        examStructure: routeExamStructure,
        aiSuggestions: routeAiSuggestions,
        images: routeImages,
        taskName: routeTaskName,
        selectedSubject: routeSelectedSubject,
        fromExamContent,
      } = route.params;

      // 如果是从ExamContentScreen返回，加载传递的数据
      if (fromExamContent) {
        if (routeExamStructure) {
          setExamStructure(routeExamStructure);
        }

        if (routeAiSuggestions) {
          setAiSuggestions(routeAiSuggestions);
        }

        if (routeImages) {
          setUploadedImages(routeImages);
        }

        if (routeTaskName) {
          setTaskName(routeTaskName);
        }

        if (routeSelectedSubject) {
          setSelectedSubject(routeSelectedSubject);
        }
      }
    }
  }, [route.params]);

  // 处理日期选择
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  // 处理返回按钮点击
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 处理发布任务
  const handlePublishTask = () => {
    // 验证必填字段
    if (!taskName.trim()) {
      Alert.alert('提示', '请输入任务名称');
      return;
    }

    if (uploadedImages.length === 0) {
      Alert.alert('提示', '请上传至少一张试卷图片');
      return;
    }

    if (examStructure.length === 0) {
      Alert.alert('提示', '请添加至少一种题型');
      return;
    }

    // 构建任务数据
    const taskData = {
      name: taskName,
      type: taskType === 'exam' ? 1 : 2, // 1-试卷批改，2-作业批改
      subjectId: subjects.indexOf(selectedSubject) + 1, // 转换为ID
      deadline: dueDate.toISOString(),
      reminder: reminderEnabled,
      aiAutoGrade: autoGradingEnabled,
      teacherReview: teacherReviewEnabled,
      publishGradeImmediately: publishResultsEnabled,
      priority: priority,
      taskNotification: taskNotificationEnabled,
      deadlineNotification: deadlineReminderEnabled,
      gradeNotification: gradingCompleteNotificationEnabled,
      classIds: selectedClasses.map((_, index) => index + 1), // 模拟班级ID
      questionTypes: examStructure.map((item, index) => ({
        name: item.type,
        sequence: index + 1,
        questionCount: item.count,
        pointsPerQuestion: parseInt(item.score.replace(/[^0-9]/g, '') || '0'),
        totalPoints:
          item.count * parseInt(item.score.replace(/[^0-9]/g, '') || '0'),
        questions: [],
      })),
      status: 1, // 已发布状态
      images: uploadedImages.map(img => img.uri),
    };

    // 发布任务
    dispatch(publishTask(taskData))
      .then(() => {
        // 发布成功后返回上一页
        Alert.alert('成功', '任务已发布', [
          {text: '确定', onPress: () => navigation.goBack()},
        ]);
      })
      .catch(err => {
        console.error('发布任务失败:', err);
      });
  };

  // 处理保存草稿
  const dispatch = useDispatch();
  const {loading, error, success, draftSaved} = useSelector(
    (state: RootState) => state.task,
  );

  // 清除错误
  useEffect(() => {
    return () => {
      dispatch(clearTaskErrors());
    };
  }, [dispatch]);

  const handleSaveDraft = () => {
    // 验证必填字段
    if (!taskName.trim()) {
      Alert.alert('提示', '请输入任务名称');
      return;
    }

    // 构建任务数据
    const taskData = {
      name: taskName,
      type: taskType === 'exam' ? 1 : 2, // 1-试卷批改，2-作业批改
      subjectId: subjects.indexOf(selectedSubject) + 1, // 转换为ID
      deadline: dueDate.toISOString(),
      reminder: reminderEnabled,
      aiAutoGrade: autoGradingEnabled,
      teacherReview: teacherReviewEnabled,
      publishGradeImmediately: publishResultsEnabled,
      priority: priority,
      taskNotification: taskNotificationEnabled,
      deadlineNotification: deadlineReminderEnabled,
      gradeNotification: gradingCompleteNotificationEnabled,
      classIds: selectedClasses.map((_, index) => index + 1), // 模拟班级ID
      questionTypes: examStructure.map((item, index) => ({
        name: item.type,
        sequence: index + 1,
        questionCount: item.count,
        pointsPerQuestion: parseInt(item.score.replace(/[^0-9]/g, '') || '0'),
        totalPoints:
          item.count * parseInt(item.score.replace(/[^0-9]/g, '') || '0'),
        questions: [],
      })),
      status: 0, // 草稿状态
      images: uploadedImages.map(img => img.uri),
    };

    // 保存草稿
    dispatch(saveDraft(taskData));

    // 显示保存成功提示
    Alert.alert('成功', '草稿已保存');
  };

  // 处理拍照上传
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

  // 处理确认图片后的回调
  const handleConfirmImages = () => {
    // 设置分析状态
    setIsAnalyzing(true);

    // 模拟分析延迟
    setTimeout(() => {
      // 模拟分析结果
      setExamStructure([
        {id: 1, type: '选择题', count: 10, score: '每题2分'},
        {id: 2, type: '填空题', count: 5, score: '每题4分'},
        {id: 3, type: '解答题', count: 5, score: '共50分'},
      ]);

      // 设置AI建议
      setAiSuggestions([
        '添加更详细的评分标准，特别是解答题部分',
        '设置合理的截止日期，建议至少预留3天时间',
        '考虑添加知识点标签，便于后续分析学生掌握情况',
      ]);

      // 分析完成
      setIsAnalyzing(false);

      // 滚动到试卷结构部分
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: examStructureSectionY,
          animated: true,
        });
      }
    }, 3000);
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

  // 处理添加题型
  const handleAddQuestionType = () => {
    Alert.alert('添加题型', '请选择要添加的题型', [
      {
        text: '选择题',
        onPress: () => {
          const newId =
            examStructure.length > 0
              ? Math.max(...examStructure.map(item => item.id)) + 1
              : 1;
          setExamStructure([
            ...examStructure,
            {id: newId, type: '选择题', count: 5, score: '每题2分'},
          ]);
        },
      },
      {
        text: '填空题',
        onPress: () => {
          const newId =
            examStructure.length > 0
              ? Math.max(...examStructure.map(item => item.id)) + 1
              : 1;
          setExamStructure([
            ...examStructure,
            {id: newId, type: '填空题', count: 3, score: '每题4分'},
          ]);
        },
      },
      {
        text: '解答题',
        onPress: () => {
          const newId =
            examStructure.length > 0
              ? Math.max(...examStructure.map(item => item.id)) + 1
              : 1;
          setExamStructure([
            ...examStructure,
            {id: newId, type: '解答题', count: 2, score: '共20分'},
          ]);
        },
      },
      {
        text: '取消',
        style: 'cancel',
      },
    ]);
  };

  // 处理编辑题型
  const handleEditQuestionType = id => {
    const questionType = examStructure.find(item => item.id === id);
    if (!questionType) return;

    Alert.alert(`编辑${questionType.type}`, '请选择操作', [
      {
        text: '修改题目数量',
        onPress: () => {
          // 这里可以添加修改题目数量的逻辑
          Alert.prompt(
            '修改题目数量',
            '请输入题目数量',
            [
              {
                text: '取消',
                style: 'cancel',
              },
              {
                text: '确定',
                onPress: count => {
                  const newStructure = examStructure.map(item => {
                    if (item.id === id) {
                      return {...item, count: parseInt(count) || item.count};
                    }
                    return item;
                  });
                  setExamStructure(newStructure);
                },
              },
            ],
            'plain-text',
            questionType.count.toString(),
          );
        },
      },
      {
        text: '修改分值',
        onPress: () => {
          // 这里可以添加修改分值的逻辑
          Alert.prompt(
            '修改分值',
            '请输入分值',
            [
              {
                text: '取消',
                style: 'cancel',
              },
              {
                text: '确定',
                onPress: score => {
                  const newStructure = examStructure.map(item => {
                    if (item.id === id) {
                      return {...item, score};
                    }
                    return item;
                  });
                  setExamStructure(newStructure);
                },
              },
            ],
            'plain-text',
            questionType.score,
          );
        },
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          const newStructure = examStructure.filter(item => item.id !== id);
          setExamStructure(newStructure);
        },
      },
      {
        text: '取消',
        style: 'cancel',
      },
    ]);
  };

  // 处理上传标准答案
  const handleUploadAnswers = () => {
    Alert.alert('上传标准答案', '请选择上传方式', [
      {
        text: '拍照上传',
        onPress: handleCameraUpload,
      },
      {
        text: '文件上传',
        onPress: handleFileUpload,
      },
      {
        text: '取消',
        style: 'cancel',
      },
    ]);
  };

  // 处理AI生成答案
  const handleAIGenerateAnswers = () => {
    if (uploadedImages.length === 0) {
      Alert.alert('提示', '请先上传试卷，AI将根据试卷内容生成答案');
      return;
    }

    // 模拟AI生成答案的过程
    Alert.alert(
      'AI生成答案',
      'AI正在分析试卷并生成答案，这可能需要几分钟时间。是否继续？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '继续',
          onPress: () => {
            // 这里可以添加调用AI生成答案的逻辑
            Alert.alert('提示', 'AI已开始分析，完成后将通知您');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#4b5563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>新增任务</Text>
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

        <ScrollView ref={scrollViewRef} style={styles.scrollView}>
          {/* 任务类型选择 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>任务类型</Text>
            <View style={styles.taskTypeContainer}>
              <TaskTypeItem
                icon="file-text"
                title="试卷批改"
                subtitle="批改试卷并分析"
                isSelected={taskType === 'exam'}
                onPress={() => setTaskType('exam')}
              />
              <TaskTypeItem
                icon="book-open"
                title="作业批改"
                subtitle="批改日常作业"
                isSelected={taskType === 'homework'}
                onPress={() => setTaskType('homework')}
              />
            </View>
          </View>

          {/* 基本信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>基本信息</Text>

            {/* 任务名称 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>任务名称</Text>
              <TextInput
                style={styles.textInput}
                placeholder="例如：期中数学试卷"
                value={taskName}
                onChangeText={setTaskName}
              />
            </View>

            {/* 科目选择 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>科目</Text>
              <View style={styles.tagsContainer}>
                {subjects.map(subject => (
                  <SubjectTag
                    key={subject}
                    label={subject}
                    isSelected={selectedSubject === subject}
                    onPress={() => setSelectedSubject(subject)}
                  />
                ))}
              </View>
            </View>

            {/* 班级选择 */}
            <View style={styles.inputContainer}>
              <View style={styles.rowBetween}>
                <Text style={styles.inputLabel}>班级</Text>
                <TouchableOpacity>
                  <Text style={styles.actionText}>添加班级</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {selectedClasses.map(cls => (
                  <ClassTag
                    key={cls}
                    label={cls}
                    isSelected={true}
                    onPress={() => {}}
                  />
                ))}
              </View>
            </View>

            {/* 截止日期 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>截止日期</Text>
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateText}>
                    {dueDate.toLocaleDateString('zh-CN')}
                  </Text>
                </TouchableOpacity>
                <View style={styles.reminderContainer}>
                  <Text style={styles.reminderText}>提醒</Text>
                  <Switch
                    value={reminderEnabled}
                    onValueChange={setReminderEnabled}
                    trackColor={{false: '#d1d5db', true: '#0ea5e9'}}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#d1d5db"
                  />
                </View>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
          </View>

          {/* 试卷内容 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>试卷内容</Text>

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

              {/* 添加确认按钮 */}
              {uploadedImages.length > 0 && (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleConfirmImages()}>
                  <Text style={styles.confirmButtonText}>
                    {isAnalyzing ? '分析试卷中' : '确认并继续'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 试卷结构 */}
            <View
              style={styles.inputContainer}
              onLayout={event => {
                const {y} = event.nativeEvent.layout;
                setExamStructureSectionY(y);
              }}>
              <View style={styles.rowBetween}>
                <Text style={styles.inputLabel}>试卷结构</Text>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>AI识别</Text>
                  <Switch
                    value={aiRecognitionEnabled}
                    onValueChange={setAiRecognitionEnabled}
                    trackColor={{false: '#d1d5db', true: '#0ea5e9'}}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#d1d5db"
                  />
                </View>
              </View>
              <View style={styles.examStructureList}>
                {examStructure.map(item => (
                  <ExamStructureItemComponent
                    key={item.id}
                    index={item.id}
                    title={item.type}
                    count={item.count}
                    score={item.score}
                    onPress={() => handleEditQuestionType(item.id)}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={styles.addQuestionButton}
                onPress={handleAddQuestionType}>
                <Icon name="plus" size={12} color="#0284c7" />
                <Text style={styles.addQuestionText}>添加题型</Text>
              </TouchableOpacity>
            </View>

            {/* 答案与评分标准 */}
            <View style={styles.inputContainer}>
              <View style={styles.rowBetween}>
                <Text style={styles.inputLabel}>答案与评分标准</Text>
                <TouchableOpacity onPress={handleAIGenerateAnswers}>
                  <Text style={styles.actionText}>AI生成</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.answerContainer}>
                <View style={styles.aiSuggestionHeader}>
                  <View style={styles.aiIconContainer}>
                    <Icon name="sparkles" size={12} color="#2563eb" />
                  </View>
                  <Text style={styles.aiSuggestionTitle}>AI建议</Text>
                </View>
                <Text style={styles.aiSuggestionDescription}>
                  上传试卷后，AI将自动识别题目并生成答案和评分标准。您也可以手动编辑或上传标准答案。
                </Text>
                <TouchableOpacity
                  style={styles.uploadAnswerButton}
                  onPress={handleUploadAnswers}>
                  <Text style={styles.uploadAnswerButtonText}>
                    上传标准答案
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* AI助手建议 */}
          <View style={styles.section}>
            <View style={styles.aiAssistantHeader}>
              <View style={styles.aiAssistantIconContainer}>
                <Icon name="sparkles" size={16} color="#2563eb" />
              </View>
              <Text style={styles.aiAssistantTitle}>AI助手建议</Text>
            </View>
            <View style={styles.aiAssistantContent}>
              <Text style={styles.aiAssistantDescription}>
                根据您上传的试卷内容，我们建议：
              </Text>
              <View style={styles.aiSuggestionsList}>
                {aiSuggestions.map((suggestion, index) => (
                  <AISuggestionItem
                    key={index}
                    index={index + 1}
                    content={suggestion}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* 批改设置 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>批改设置</Text>

            <View style={styles.settingsContainer}>
              <SettingItem
                title="AI自动批改"
                value={autoGradingEnabled}
                onChange={setAutoGradingEnabled}
              />

              <SettingItem
                title="教师审核"
                value={teacherReviewEnabled}
                onChange={setTeacherReviewEnabled}
              />

              <SettingItem
                title="批改后立即公布成绩"
                value={publishResultsEnabled}
                onChange={setPublishResultsEnabled}
              />

              <PrioritySlider value={priority} onChange={setPriority} />
            </View>
          </View>

          {/* 通知设置 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>通知设置</Text>

            <View style={styles.settingsContainer}>
              <SettingItem
                title="发布任务通知"
                value={taskNotificationEnabled}
                onChange={setTaskNotificationEnabled}
              />

              <SettingItem
                title="截止日期提醒"
                value={deadlineReminderEnabled}
                onChange={setDeadlineReminderEnabled}
              />

              <SettingItem
                title="批改完成通知"
                value={gradingCompleteNotificationEnabled}
                onChange={setGradingCompleteNotificationEnabled}
              />
            </View>
          </View>

          {/* 底部间距 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* 底部工具栏 */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDraft}>
            <Text style={styles.saveButtonText}>保存草稿</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublishTask}>
            <Text style={styles.publishButtonText}>发布任务</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#4b5563',
  },
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
  taskTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  aiSuggestionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    flex: 1,
    marginLeft: 12,
  },
  taskTypeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  taskTypeItemSelected: {
    borderWidth: 2,
    borderColor: '#0284c7',
  },
  taskTypeItemNormal: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  taskTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTypeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  taskTypeSubtitle: {
    fontSize: 12,
    color: '#6b7280',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  // 试卷结构相关样式
  examStructureList: {
    marginTop: 8,
    marginBottom: 8,
  },
  examStructureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  examStructureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  examStructureIndex: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  examStructureIndexText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0284c7',
  },
  examStructureTitle: {
    fontSize: 14,
    color: '#1f2937',
  },
  examStructureRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  examStructureInfo: {
    fontSize: 12,
    color: '#6b7280',
  },
  examStructureDivider: {
    fontSize: 12,
    color: '#6b7280',
  },
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 8,
    marginTop: 8,
  },
  addQuestionText: {
    fontSize: 12,
    color: '#0284c7',
  },
  // 答案与评分标准相关样式
  answerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  aiSuggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSuggestionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
  },
  aiSuggestionDescription: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 8,
  },
  uploadAnswerButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  uploadAnswerButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  // AI助手建议相关样式
  aiAssistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiAssistantIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAssistantTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
  aiAssistantContent: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
  },
  aiAssistantDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  aiSuggestionsList: {
    gap: 8,
  },
  aiSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  aiSuggestionIndex: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  aiSuggestionIndexText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#2563eb',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  subjectTagSelected: {
    backgroundColor: '#e0f2fe',
  },
  subjectTagNormal: {
    backgroundColor: '#f3f4f6',
  },
  subjectTagText: {
    fontSize: 12,
  },
  subjectTagTextSelected: {
    color: '#0284c7',
  },
  subjectTagTextNormal: {
    color: '#4b5563',
  },
  classTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
  },
  classTagSelected: {},
  classTagNormal: {},
  classTagText: {
    fontSize: 12,
    color: '#0284c7',
  },
  classTagTextSelected: {},
  classTagTextNormal: {},
  actionText: {
    fontSize: 12,
    color: '#0284c7',
  },
  datePickerButton: {
    paddingVertical: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#1f2937',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderText: {
    fontSize: 12,
    color: '#6b7280',
  },
  uploadOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  uploadOptionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  uploadOptionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadOptionText: {
    fontSize: 14,
    color: '#0284c7',
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  fileFormatContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  // 在styles对象中添加或修改以下样式
  uploadedFilesContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
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
    color: '#0284c7',
  },
  clearAllText: {
    fontSize: 12,
    color: '#ef4444',
  },
  uploadedFilesScroll: {
    flexDirection: 'row',
    padding: 10,
  },
  uploadedFileItem: {
    width: 80,
    marginRight: 8,
    position: 'relative',
  },
  uploadedFileThumb: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    marginTop: 8,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 12,
    color: '#0284c7',
  },
  aiSuggestionBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  aiIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  aiSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiSectionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
  aiSuggestionContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
  },
  aiSuggestionText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  aiSuggestionList: {
    gap: 8,
  },
  settingsContainer: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  settingTitle: {
    fontSize: 14,
    color: '#1f2937',
  },
  prioritySlider: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  prioritySliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityValue: {
    fontSize: 12,
    color: '#0284c7',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  bottomSpacer: {
    height: 80,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 12,
    color: '#4b5563',
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  publishButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
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
    padding: 20,
  },
  previewCloseButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  previewCloseText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  previewImageContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewFileName: {
    marginTop: 16,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default CreateTaskScreen;
