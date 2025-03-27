// 菜单项组件

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from'react-native';
import { STATUS_BAR_HEIGHT } from '../../utils/devicesUtils';


export const MenuItem = ({ icon, iconColor, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuItemIcon, { backgroundColor: iconColor + '15' }]}>
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

  const styles = StyleSheet.create({
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
  });