/**
 * 登录界面组件
 * 实现密码登录和验证码登录两种方式
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
  login,
  loginWithSms,
  sendSmsCode,
  clearErrors,
} from '../../store/actions/authActions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation';
import {RootState, AppDispatch} from '../../store';
import Toast from 'react-native-toast-message';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

/**
 * 登录界面组件
 * @returns {JSX.Element} 登录界面
 */
// 在文件顶部导入区域添加 AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  // 导航对象
  const navigation = useNavigation<LoginScreenNavigationProp>();
  // Redux dispatch
  const dispatch = useDispatch<AppDispatch>();
  // 从Redux store获取状态
  const {
    loading,
    error,
    isAuthenticated,
    smsCodeSending,
    smsCodeSent,
    smsError,
  } = useSelector((state: RootState) => state.auth);
  // 本地状态
  const [loginType, setLoginType] = useState<'password' | 'sms'>('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 监听认证状态变化，当用户登录成功后自动导航到Main页面
  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Main');
    }
  }, [isAuthenticated, navigation]);
  
  /**
   * 处理登录类型切换
   * @param {string} type - 登录类型 'password' 或 'sms'
   */
  const handleLoginTypeChange = (type: 'password' | 'sms') => {
    setLoginType(type);
    // 清除错误信息
    dispatch(clearErrors());
  };
  /**
   * 处理登录按钮点击
   */
  const handleLogin = () => {
    // 清除错误信息
    dispatch(clearErrors());
    if (loginType === 'password') {
      // 密码登录验证
      if (!username.trim()) {
        Toast.show({
          type: 'info',
          text1: '登录失败',
          text2: '用户名或手机号不能为空',
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
        });
        return;
      }
      if (!password) {
        Toast.show({
          type: 'info',
          text1: '登录失败',
          text2: '请输入密码',
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
        });
        return;
      }
      // 调用密码登录action
      dispatch(login(username, password));
      // 如果选择了"记住我"，保存登录信息
      if (rememberMe) {
        saveCredentials(username, password);
      } else {
        // 如果没有选择"记住我"，清除之前保存的信息
        clearSavedCredentials();
      }
    } else {
      // 验证码登录验证
      if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone)) {
        // Alert.alert('提示', '请输入正确的手机号');
        Toast.show({
          type: 'info',
          text1: '登录失败',
          text2: '请输入正确的手机号',
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
        });
        return;
      }
      if (!smsCode.trim()) {
        // Alert.alert('提示', '请输入验证码');
        Toast.show({
          type: 'info',
          text1: '登录失败',
          text2: '请输入验证码',
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
        });
        return;
      }
      // 调用验证码登录action
      dispatch(loginWithSms(phone, smsCode));
    }
  };
  /**
   * 处理发送验证码
   */
  const handleSendSmsCode = () => {
    // 验证手机号
    if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone)) {
      // Alert.alert('提示', '请输入正确的手机号');
      Toast.show({
        type: 'info',
        text1: '发送验证码失败',
        text2: '请输入正确的手机号',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }
    // 发送验证码
    dispatch(sendSmsCode(phone, 'login'));
    // 开始倒计时
    if (smsCodeSent) {
      setCountdown(60);
    }
  };
  /**
   * 处理注册按钮点击
   */
  const handleRegister = () => {
    navigation.navigate('Register');
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

  // 在组件加载时检查是否有保存的登录信息
  useEffect(() => {
    const checkSavedCredentials = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem('userCredentials');
        if (savedCredentials) {
          const credentials = JSON.parse(savedCredentials);
          setUsername(credentials.username);
          setPassword(credentials.password);
          setRememberMe(true);
        }
      } catch (err) {
        console.error('读取保存的登录信息失败:', err);
      }
    };

    checkSavedCredentials();
  }, []);

  /**
   * 保存登录凭证
   */
  const saveCredentials = async (savedUsername: string, savedPassword: string) => {
    try {
      const credentials = JSON.stringify({savedUsername, savedPassword});
      await AsyncStorage.setItem('userCredentials', credentials);
      console.log('登录信息已保存');
    } catch (err) {
      console.error('保存登录信息失败:', err);
    }
  };

  /**
   * 清除保存的登录凭证
   */
  const clearSavedCredentials = async () => {
    try {
      await AsyncStorage.removeItem('userCredentials');
      console.log('保存的登录信息已清除');
    } catch (err) {
      console.error('清除登录信息失败:', err);
    }
  };

  // 显示错误信息
  useEffect(() => {
    if (error) {
      // Alert.alert('登录失败', error);
      Toast.show({
        type: 'error',
        text1: '登录失败',
        text2: error,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
      });
      dispatch(clearErrors());
    }

    if (smsError) {
      // Alert.alert('发送验证码失败', smsError);
      Toast.show({
        type: 'error',
        text1: '发送验证码失败',
        text2: smsError,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
      });
      dispatch(clearErrors());
    }
  }, [error, smsError, dispatch]);

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

          {/* 登录表单 */}
          <View style={styles.formContainer}>
            {/* 欢迎文字 */}
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>欢迎回来</Text>
                <Text style={styles.welcomeSubtext}>
                  请登录您的账号继续使用
                </Text>
              </View>

              {/* 登录方式切换 */}
              <View style={styles.loginTypeContainer}>
                <TouchableOpacity
                  onPress={() => handleLoginTypeChange('password')}
                  style={styles.loginTypeButton}>
                  <Text
                    style={[
                      styles.loginTypeText,
                      loginType === 'password' && styles.activeLoginTypeText,
                    ]}>
                    密码登录
                  </Text>
                  {loginType === 'password' && (
                    <View style={styles.activeLoginTypeLine} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleLoginTypeChange('sms')}
                  style={styles.loginTypeButton}>
                  <Text
                    style={[
                      styles.loginTypeText,
                      loginType === 'sms' && styles.activeLoginTypeText,
                    ]}>
                    验证码登录
                  </Text>
                  {loginType === 'sms' && (
                    <View style={styles.activeLoginTypeLine} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* 密码登录表单 */}
            {loginType === 'password' && (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Image
                    source={require('../../assets/icons/user.png')}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="用户名/手机号"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Image
                    source={require('../../assets/icons/lock.png')}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="密码"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <View style={styles.rememberForgotContainer}>
                  <TouchableOpacity
                    style={styles.rememberMeContainer}
                    onPress={() => setRememberMe(!rememberMe)}>
                    <View
                      style={[
                        styles.checkbox,
                        rememberMe && styles.checkboxChecked,
                      ]}>
                      {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.rememberMeText}>记住我</Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>忘记密码?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 验证码登录表单 */}
            {loginType === 'sms' && (
              <View style={styles.inputContainer}>
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
              </View>
            )}

            {/* 登录按钮 */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>登录</Text>
              )}
            </TouchableOpacity>

            {/* 第三方登录 */}
            <View style={styles.otherLoginContainer}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>其他登录方式</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.wechatButton]}>
                  <Image
                    source={require('../../assets/icons/wechat.png')}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.qqButton]}>
                  <Image
                    source={require('../../assets/icons/message-circle.png')}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.emailButton]}>
                  <Image
                    source={require('../../assets/icons/mail.png')}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 注册入口 */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>还没有账号? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>立即注册</Text>
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
  welcomeContainer: {
    marginBottom: 20,
  },
  welcomeTextContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#666',
  },
  loginTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  loginTypeButton: {
    marginLeft: 16,
    paddingBottom: 4,
  },
  loginTypeText: {
    fontSize: 14,
    color: '#666',
  },
  activeLoginTypeText: {
    color: '#6474f4',
    fontWeight: '500',
  },
  activeLoginTypeLine: {
    height: 2,
    backgroundColor: '#6474f4',
    marginTop: 4,
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
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  rememberMeText: {
    fontSize: 14,
    color: '#666',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6474f4',
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
  loginButton: {
    backgroundColor: '#6474f4',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  otherLoginContainer: {
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#999',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  wechatButton: {
    backgroundColor: '#f0fff4',
  },
  qqButton: {
    backgroundColor: '#e6f7ff',
  },
  emailButton: {
    backgroundColor: '#fff1f0',
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  registerLink: {
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

export default LoginScreen;
