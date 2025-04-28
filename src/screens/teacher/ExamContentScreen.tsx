/**
 * 试卷内容页面
 * 用于展示试卷内容、答案和AI建议
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  STATUS_BAR_HEIGHT,
  BOTTOM_SAFE_AREA_HEIGHT,
} from '../../utils/devicesUtils';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../../components/common/Icon';

// 已替换为统一的Icon组件

// 试卷结构项组件
const ExamStructureItem = ({index, title, count, score, onPress}) => (
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

const ExamContentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {images, taskType, taskName, selectedSubject} = route.params || {};

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [examStructure, setExamStructure] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPreviewImage, setCurrentPreviewImage] = useState(null);

  // 模拟AI分析过程
  useEffect(() => {
    // 模拟分析延迟
    const timer = setTimeout(() => {
      // 模拟分析结果
      setExamStructure([
        {id: 1, title: '选择题', count: 10, score: '每题2分'},
        {id: 2, title: '填空题', count: 5, score: '每题4分'},
        {id: 3, title: '解答题', count: 5, score: '共50分'},
      ]);

      setAiSuggestions([
        '添加更详细的评分标准，特别是解答题部分',
        '设置合理的截止日期，建议至少预留3天时间',
        '考虑添加知识点标签，便于后续分析学生掌握情况',
      ]);

      setIsAnalyzing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 处理返回按钮点击
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 处理完成按钮点击
  const handleComplete = () => {
    // 返回到创建任务页面，传递试卷结构和AI建议
    navigation.navigate('CreateTask', {
      examStructure: examStructure.map(item => ({
        id: item.id,
        type: item.title,
        count: item.count,
        score: item.score,
      })),
      aiSuggestions,
      images,
      taskType,
      taskName,
      selectedSubject,
      fromExamContent: true, // 标记来源，便于CreateTaskScreen识别
    });
  };

  // 处理图片预览
  const handlePreviewImage = image => {
    setCurrentPreviewImage(image);
    setPreviewVisible(true);
  };

  // 关闭图片预览
  const handleClosePreview = () => {
    setPreviewVisible(false);
    setCurrentPreviewImage(null);
  };

  // 渲染试卷图片
  const renderExamImages = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.examImagesContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.examImageItem}
            onPress={() => handlePreviewImage(image)}>
            <Image
              source={{uri: image.uri}}
              style={styles.examImage}
              resizeMode="cover"
            />
            <Text style={styles.examImageCaption} numberOfLines={1}>
              {image.fileName || `照片 ${index + 1}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 图片预览模态框 */}
        {previewVisible && (
          <View style={styles.previewContainer}>
            <TouchableOpacity
              style={styles.previewCloseButton}
              onPress={handleClosePreview}>
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
        {/* 顶部导航 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#4b5563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>试卷内容</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Icon name="help-circle" size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        {isAnalyzing ? (
          // 加载中状态
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingText}>正在分析试卷内容...</Text>
          </View>
        ) : (
          // 分析完成状态
          <ScrollView style={styles.scrollView}>
            {/* 试卷图片 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>试卷图片</Text>
              {renderExamImages()}
            </View>

            {/* 试卷结构 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>试卷结构</Text>
              <View style={styles.examStructureList}>
                {examStructure.map((item, index) => (
                  <ExamStructureItem
                    key={item.id}
                    index={index + 1}
                    title={item.title}
                    count={item.count}
                    score={item.score}
                    onPress={() => {}}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Icon name="plus" size={16} color="#0284c7" />
                <Text style={styles.addButtonText}>添加题型</Text>
              </TouchableOpacity>
            </View>

            {/* 答案上传 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>答案上传</Text>
              <View style={styles.aiSuggestionBox}>
                <View style={styles.aiSuggestionHeader}>
                  <View style={styles.aiIcon}>
                    <Icon name="sparkles" size={12} color="#2563eb" />
                  </View>
                  <Text style={styles.aiSuggestionTitle}>AI建议</Text>
                </View>
                <Text style={styles.aiSuggestionDescription}>
                  上传标准答案可以提高AI批改的准确率，特别是对于主观题。
                </Text>
                <TouchableOpacity style={styles.uploadAnswerButton}>
                  <Text style={styles.uploadAnswerButtonText}>上传答案</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* AI建议 */}
            <View style={styles.aiSection}>
              <View style={styles.aiSectionHeader}>
                <View style={styles.aiSectionIcon}>
                  <Icon name="sparkles" size={16} color="#2563eb" />
                </View>
                <Text style={styles.aiSectionTitle}>AI建议</Text>
              </View>
              <View style={styles.aiSuggestionContainer}>
                <Text style={styles.aiSuggestionText}>
                  基于您上传的试卷内容，AI提供以下建议：
                </Text>
                <View style={styles.aiSuggestionList}>
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

            {/* 底部间距 */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}

        {/* 底部工具栏 */}
        {!isAnalyzing && (
          <View
            style={[
              styles.footer,
              {paddingBottom: BOTTOM_SAFE_AREA_HEIGHT / 2},
            ]}>
            <TouchableOpacity style={styles.editButton} onPress={handleGoBack}>
              <Icon name="edit" size={16} color="#4b5563" />
              <Text style={styles.editButtonText}>编辑图片</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}>
              <Icon name="check" size={16} color="#ffffff" />
              <Text style={styles.completeButtonText}>确认完成</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    top: STATUS_BAR_HEIGHT + 10,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  previewCloseText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewImageContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '90%',
  },
  previewFileName: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 10,
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
    paddingTop: (STATUS_BAR_HEIGHT + 30) / 2,
    height: STATUS_BAR_HEIGHT + 30,
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
  examImagesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  examImageItem: {
    width: 120,
    marginRight: 8,
  },
  examImage: {
    width: 120,
    height: 160,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  examImageCaption: {
    fontSize: 10,
    color: '#4b5563',
    marginTop: 4,
    textAlign: 'center',
  },
  examStructureList: {
    marginTop: 8,
    gap: 8,
  },
  examStructureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
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
    gap: 8,
  },
  examStructureInfo: {
    fontSize: 12,
    color: '#6b7280',
  },
  examStructureDivider: {
    fontSize: 12,
    color: '#d1d5db',
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
    backgroundColor: '#ffffff',
  },
  aiSuggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiIcon: {
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
  aiSuggestionContent: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 12,
    color: '#4b5563',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  completeButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default ExamContentScreen;
