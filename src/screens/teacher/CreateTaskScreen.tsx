/**
 * 教师端创建任务组件
 * 用于创建新的批改任务，包括试卷批改和作业批改
 */

import React, { useState } from 'react';
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
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
// 导入图标资源
import {
    fileIcon,
    bookIcon,
    plusIcon,
    homeIcon
} from '../../assets/icons';

// 图标组件
const Icon = ({ name, size = 24, color = '#000' }) => {
    // 根据图标名称返回对应的图标组件
    const getIconSource = iconName => {
        switch (iconName) {
            case 'arrow-left':
                return homeIcon; // 临时替代
            case 'help-circle':
                return homeIcon; // 临时替代
            case 'file-text':
                return fileIcon;
            case 'book-open':
                return bookIcon;
            case 'upload-cloud':
                return homeIcon; // 临时替代
            case 'chevron-right':
                return homeIcon; // 临时替代
            case 'plus':
                return plusIcon;
            case 'sparkles':
                return homeIcon; // 临时替代
            default:
                return homeIcon;
        };
    }
    return (
        <Image
            source={getIconSource(name)}
            style={{ width: size, height: size, tintColor: color }}
        />
    );
};

// 任务类型选择项组件
const TaskTypeItem = ({ icon, title, subtitle, isSelected, onPress }) => (
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
                { backgroundColor: isSelected ? '#e0f2fe' : '#f3f4f6' },
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
const SubjectTag = ({ label, isSelected, onPress }) => (
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
const ClassTag = ({ label, isSelected, onPress, onRemove }) => (
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
const ExamStructureItem = ({ index, title, count, score, onPress }) => (
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
const AISuggestionItem = ({ index, content }) => (
    <View style={styles.aiSuggestionItem}>
        <View style={styles.aiSuggestionIndex}>
            <Text style={styles.aiSuggestionIndexText}>{index}</Text>
        </View>
        <Text style={styles.aiSuggestionContent}>{content}</Text>
    </View>
);

// 设置项组件
const SettingItem = ({ title, value, onChange }) => (
    <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Switch
            value={value}
            onValueChange={onChange}
            trackColor={{ false: '#d1d5db', true: '#0ea5e9' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#d1d5db"
        />
    </View>
);

// 优先级滑块组件
const PrioritySlider = ({ value, onChange }) => (
    <View style={styles.prioritySlider}>
        <View style={styles.prioritySliderHeader}>
            <Text style={styles.settingTitle}>批改优先级</Text>
            <Text style={styles.priorityValue}>
                {value === 0 ? '低' : value === 50 ? '标准' : '高'}
            </Text>
        </View>
        <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${value}%` }]} />
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

    // 科目列表
    const subjects = ['数学', '语文', '英语', '物理', '化学', '生物'];

    // 试卷结构
    const examStructure = [
        { id: 1, title: '选择题', count: 10, score: '每题2分' },
        { id: 2, title: '填空题', count: 5, score: '每题4分' },
        { id: 3, title: '解答题', count: 5, score: '共50分' },
    ];

    // AI建议
    const aiSuggestions = [
        '添加更详细的评分标准，特别是解答题部分',
        '设置合理的截止日期，建议至少预留3天时间',
        '考虑添加知识点标签，便于后续分析学生掌握情况',
    ];

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
        // 这里实现任务发布逻辑
        console.log('发布任务', {
            taskType,
            taskName,
            selectedSubject,
            selectedClasses,
            dueDate,
            reminderEnabled,
            aiRecognitionEnabled,
            autoGradingEnabled,
            teacherReviewEnabled,
            publishResultsEnabled,
            priority,
            taskNotificationEnabled,
            deadlineReminderEnabled,
            gradingCompleteNotificationEnabled,
        });

        // 发布成功后返回上一页
        navigation.goBack();
    };

    // 处理保存草稿
    const handleSaveDraft = () => {
        // 这里实现保存草稿逻辑
        console.log('保存草稿');
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

                <ScrollView style={styles.scrollView}>
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
                                        onPress={() => { }}
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
                                        trackColor={{ false: '#d1d5db', true: '#0ea5e9' }}
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
                            <TouchableOpacity style={styles.uploadContainer}>
                                <Icon name="upload-cloud" size={32} color="#9ca3af" />
                                <Text style={styles.uploadText}>点击或拖拽文件到此处上传</Text>
                                <Text style={styles.uploadSubtext}>
                                    支持 PDF、Word、图片格式
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* 试卷结构 */}
                        <View style={styles.inputContainer}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.inputLabel}>试卷结构</Text>
                                <View style={styles.switchContainer}>
                                    <Text style={styles.switchLabel}>AI识别</Text>
                                    <Switch
                                        value={aiRecognitionEnabled}
                                        onValueChange={setAiRecognitionEnabled}
                                        trackColor={{ false: '#d1d5db', true: '#0ea5e9' }}
                                        thumbColor="#ffffff"
                                        ios_backgroundColor="#d1d5db"
                                    />
                                </View>
                            </View>
                            <View style={styles.examStructureList}>
                                {examStructure.map(item => (
                                    <ExamStructureItem
                                        key={item.id}
                                        index={item.id}
                                        title={item.title}
                                        count={item.count}
                                        score={item.score}
                                        onPress={() => { }}
                                    />
                                ))}
                            </View>
                            <TouchableOpacity style={styles.addButton}>
                                <Icon name="plus" size={12} color="#0284c7" />
                                <Text style={styles.addButtonText}>添加题型</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 答案与评分标准 */}
                        <View style={styles.inputContainer}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.inputLabel}>答案与评分标准</Text>
                                <TouchableOpacity>
                                    <Text style={styles.actionText}>AI生成</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.aiSuggestionBox}>
                                <View style={styles.aiSuggestionHeader}>
                                    <View style={styles.aiIcon}>
                                        <Icon name="sparkles" size={12} color="#2563eb" />
                                    </View>
                                    <Text style={styles.aiSuggestionTitle}>AI建议</Text>
                                </View>
                                <Text style={styles.aiSuggestionDescription}>
                                    上传试卷后，AI将自动识别题目并生成答案和评分标准。您也可以手动编辑或上传标准答案。
                                </Text>
                                <TouchableOpacity style={styles.uploadAnswerButton}>
                                    <Text style={styles.uploadAnswerButtonText}>
                                        上传标准答案
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* AI助手建议 */}
                    <View style={styles.aiSection}>
                        <View style={styles.aiSectionHeader}>
                            <View style={styles.aiSectionIcon}>
                                <Icon name="sparkles" size={16} color="#2563eb" />
                            </View>
                            <Text style={styles.aiSectionTitle}>AI助手建议</Text>
                        </View>
                        <View style={styles.aiSuggestionContainer}>
                            <Text style={styles.aiSuggestionText}>
                                根据您上传的试卷内容，我们建议：
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
        paddingTop: 16,
        paddingBottom: 12,
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
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
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
    uploadContainer: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 8,
        marginBottom: 4,
    },
    uploadSubtext: {
        fontSize: 12,
        color: '#9ca3af',
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
    examStructureList: {
        marginTop: 8,
        gap: 8,
    },
    examStructureItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
});

export default CreateTaskScreen;
