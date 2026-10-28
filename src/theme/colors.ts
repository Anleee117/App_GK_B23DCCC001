export const colors = {
  primary: '#1E40AF', // Xanh dương đậm hiện đại
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  secondary: '#0D9488', // Teal
  background: '#F8FAFC', // Nền xám xanh nhẹ
  surface: '#FFFFFF', // Card trắng
  text: '#0F172A', // Chữ đen đậm
  textSecondary: '#64748B', // Chữ phụ xám
  textMuted: '#94A3B8',
  border: '#E2E8F0', // Viền nhạt
  borderFocus: '#3B82F6',
  error: '#EF4444', // Đỏ báo lỗi / hết sách
  errorLight: '#FEE2E2',
  success: '#10B981', // Xanh lá
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  disabled: '#CBD5E1', // Nút vô hiệu hoá
  disabledText: '#94A3B8',
  cardShadow: '#000000',
  white: '#FFFFFF',
};

export const typography = {
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 14,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
