/**
 * 注册界面组件
 * 实现用户注册功能
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  register,
  sendSmsCode,
  clearErrors,
} from '../../store/actions/authActions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation';
import {RootState, AppDispatch} from '../../store';
import Toast from 'react-native-toast-message';
import {User} from '../../store/types/auth';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

// 用户数据接口
interface UserData extends User {
  smsCode: string;
}

/**
 * 注册界面组件
 * @returns {JSX.Element} 注册界面
 */
const RegisterScreen = () => {
  // 导航对象
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // Redux dispatch
  const dispatch = useDispatch<AppDispatch>();

  // 从Redux store获取状态
  const {
    registerLoading,
    registerSuccess,
    registerError,
    smsCodeSending,
    smsError,
  } = useSelector((state: RootState) => state.auth);

  // 本地状态
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [studentID, setStudentID] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  /**
   * 处理发送验证码
   */
  const handleSendSmsCode = (): void => {
    // 验证手机号
    if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone)) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '请输入正确的手机号',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    // 发送验证码
    dispatch(sendSmsCode(phone));

    // 开始倒计时
    setCountdown(60);
  };

  /**
   * 处理注册按钮点击
   */
  const handleRegister = (): void => {
    // 清除错误信息
    dispatch(clearErrors());

    // 表单验证
    if (!name.trim()) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '请输入姓名',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone)) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '请输入正确的手机号',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    if (!smsCode.trim()) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '请输入验证码',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    if (!password || password.length < 6) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '密码长度至少为6位',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '两次输入的密码不一致',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    if (!studentID.trim()) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '请输入学号',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    if (!school.trim()) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '请输入学校',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    if (!role) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '请选择用户身份',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    if (!agreeTerms) {
      Toast.show({
        type: 'info',
        text1: '提示',
        text2: '请阅读并同意用户协议和隐私政策',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      return;
    }

    // 提交注册表单
    const userData: UserData = {
      username,
      name,
      phone,
      smsCode,
      password,
      studentID,
      school,
      role,
    };

    dispatch(register(userData));
  };

  /**
   * 处理返回登录界面
   */
  const handleBackToLogin = (): void => {
    navigation.navigate('Login');
  };

  // 验证码倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);

  // 注册成功后的处理
  useEffect(() => {
    if (registerSuccess) {
      Toast.show({
        type: 'success',
        text1: '注册成功',
        text2: '请使用新账号登录',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
    }
  }, [registerSuccess, navigation]);

  // 显示错误信息
  useEffect(() => {
    if (registerError) {
      Toast.show({
        type: 'error',
        text1: '注册失败',
        text2: registerError,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      dispatch(clearErrors());
    }

    if (smsError) {
      Toast.show({
        type: 'error',
        text1: '发送验证码失败',
        text2: smsError,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
      dispatch(clearErrors());
    }
  }, [registerError, smsError, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* 标题和Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>智评</Text>
            </View>
            <Text style={styles.title}>智能批改助手</Text>
            <Text style={styles.subtitle}>高效、精准的智能批改解决方案</Text>
          </View>

          {/* 注册表单 */}
          <View style={styles.formContainer}>
            {/* 标题 */}
            <View style={styles.formTitleContainer}>
              <Text style={styles.formTitle}>创建新账号</Text>
              <Text style={styles.formSubtitle}>请填写以下信息完成注册</Text>
            </View>

            {/* 输入字段 */}
            <View style={styles.inputContainer}>
              {/* 用户名 */}
              <View style={styles.inputWrapper}>
                <Image
                  source={require('../../assets/icons/user.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="用户名"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              {/* 手机号 */}
              <View style={styles.inputWrapper}>
                <Image
                  source={require('../../assets/icons/smartphone.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="手机号"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>

              {/* 验证码 */}
              <View style={styles.smsCodeContainer}>
                <View style={[styles.inputWrapper, styles.smsCodeInput]}>
                  <Image
                    source={require('../../assets/icons/message-square.png')}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="验证码"
                    value={smsCode}
                    onChangeText={setSmsCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.smsButton,
                    (countdown > 0 || smsCodeSending) &&
                      styles.smsButtonDisabled,
                  ]}
                  onPress={handleSendSmsCode}
                  disabled={countdown > 0 || smsCodeSending}>
                  {smsCodeSending ? (
                    <ActivityIndicator size="small" color="#6474f4" />
                  ) : (
                    <Text style={styles.smsButtonText}>
                      {countdown > 0
                        ? `${countdown}秒后重新获取`
                        : '获取验证码'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* 密码 */}
              <View style={styles.inputWrapper}>
                <Image
                  source={require('../../assets/icons/lock.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="设置密码"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* 确认密码 */}
              <View style={styles.inputWrapper}>
                <Image
                  source={require('../../assets/icons/check-circle.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="确认密码"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {/* 姓名 */}
              <View style={styles.inputWrapper}>
                <Image
                  source={require('../../assets/icons/user.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="姓名"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* 学校 */}
              <View style={styles.inputWrapper}>
                <Image
                  source={require('../../assets/icons/building.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="学校"
                  value={school}
                  onChangeText={setSchool}
                />
              </View>

              {/* 学号 */}
              <View style={styles.inputWrapper}>
                <Image
                  source={require('../../assets/icons/id-card.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="学号"
                  value={studentID}
                  onChangeText={setStudentID}
                />
              </View>

              {/* 用户身份：role = STUDENT or TEACHER */}
              <View style={styles.inputWrapper}>
                <Image
                  source={require('../../assets/icons/user.png')}
                  style={styles.inputIcon}
                />
                <View style={styles.radioContainer}>
                  <Text style={styles.radioLabel}>用户身份</Text>
                  <View style={styles.radioOptionsContainer}>
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setRole('STUDENT')}>
                      <View
                        style={[
                          styles.radioButton,
                          role === 'STUDENT' && styles.radioButtonSelected,
                        ]}>
                        {role === 'STUDENT' && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={styles.radioText}>学生</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setRole('TEACHER')}>
                      <View
                        style={[
                          styles.radioButton,
                          role === 'TEACHER' && styles.radioButtonSelected,
                        ]}>
                        {role === 'TEACHER' && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={styles.radioText}>教师</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 用户协议 */}
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setAgreeTerms(!agreeTerms)}>
                <View
                  style={[
                    styles.checkbox,
                    agreeTerms && styles.checkboxChecked,
                  ]}>
                  {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  我已阅读并同意
                  <Text style={styles.termsLink}>用户协议</Text> 和
                  <Text style={styles.termsLink}>隐私政策</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* 注册按钮 */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={registerLoading}>
              {registerLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>注册</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 登录入口 */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>已有账号? </Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginLink}>立即登录</Text>
            </TouchableOpacity>
          </View>

          {/* 版权信息 */}
          <Text style={styles.copyright}>
            © 2023 智评教育科技. 保留所有权利.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6474f4',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6474f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  formTitleContainer: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: '#666',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  smsCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smsCodeInput: {
    flex: 1,
    marginRight: 12,
  },
  smsButton: {
    backgroundColor: '#f0f5ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  smsButtonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  smsButtonText: {
    color: '#6474f4',
    fontSize: 14,
    fontWeight: '500',
  },
  radioContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  radioLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    alignSelf: 'center',
  },
  radioOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: '#6474f4',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6474f4',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6474f4',
    borderColor: '#6474f4',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  termsLink: {
    color: '#6474f4',
  },
  registerButton: {
    backgroundColor: '#6474f4',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loginLink: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default RegisterScreen;
