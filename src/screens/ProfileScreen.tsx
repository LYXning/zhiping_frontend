/**
 * 个人中心组件
 * 显示教师的个人信息和设置界面
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/actions/authActions';
import {AppDispatch, RootState} from '../store';

import {STATUS_BAR_HEIGHT} from '../utils/devicesUtils';
import Icon from '../components/common/Icon';

// 菜单项组件
const MenuItem = ({icon, iconColor, title, subtitle, onPress}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.menuItemIcon, {backgroundColor: iconColor + '15'}]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <View>
        <Text style={styles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Icon name="chevron-right" size={16} color="#9ca3af" />
  </TouchableOpacity>
);

// 分割线组件
const Divider = () => <View style={styles.divider} />;

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>个人中心</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="settings" size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* 个人信息卡片 */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarText}>{user.name[0]}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                {user.role === 'TEACHER' ? (
                  <Text style={styles.profileRole}>数学教师</Text>
                ) : null}
              </View>
            </View>

            {user.role === 'TEACHER' ? (
              <View style={styles.profileStats}>
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatValue}>128</Text>
                  <Text style={styles.profileStatLabel}>学生</Text>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatValue}>3</Text>
                  <Text style={styles.profileStatLabel}>班级</Text>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatValue}>26</Text>
                  <Text style={styles.profileStatLabel}>任务</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* 菜单列表 */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>账号信息</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="user"
                iconColor="#0ea5e9"
                title="个人资料"
                subtitle="编辑您的基本信息"
                onPress={() => console.log('个人资料')}
              />
              <Divider />
              <MenuItem
                icon="id-card"
                iconColor="#8b5cf6"
                title="实名认证"
                subtitle="已认证"
                onPress={() => console.log('教师认证')}
              />
              <Divider />
              <MenuItem
                icon="building"
                iconColor="#f59e0b"
                title="所属学校"
                subtitle={user.school}
                onPress={() => console.log('所属学校')}
              />
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>应用设置</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="message-square"
                iconColor="#10b981"
                title="消息通知"
                onPress={() => console.log('消息通知')}
              />
              <Divider />
              <MenuItem
                icon="lock"
                iconColor="#ef4444"
                title="隐私设置"
                onPress={() => console.log('隐私设置')}
              />
            </View>
          </View>

          {/* 退出登录按钮 */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>退出登录</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingTop: (STATUS_BAR_HEIGHT + 30) / 2,
    height: STATUS_BAR_HEIGHT + 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
  },
  iconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#6b7280',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
  },
  profileStatItem: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  profileStatDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  menuSection: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginVertical: 24,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;
