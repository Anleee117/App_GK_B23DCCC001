import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { BookListScreen } from '../screens/BookListScreen';
import { BookDetailScreen } from '../screens/BookDetailScreen';
import { BookFormScreen } from '../screens/BookFormScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BookList"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="BookList"
        component={BookListScreen}
        options={{
          title: 'Quản Lý Thư Viện',
        }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{
          title: 'Chi Tiết Sách',
        }}
      />
      <Stack.Screen
        name="BookForm"
        component={BookFormScreen}
        options={({ route }) => ({
          title: route.params?.book ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới',
        })}
      />
    </Stack.Navigator>
  );
};
