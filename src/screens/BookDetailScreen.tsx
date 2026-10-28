import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useBooks } from '../context/BookContext';
import { colors, spacing, categoryStyles } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export const BookDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { getBookById, borrowBook, returnBook, deleteBook } = useBooks();

  const book = getBookById(bookId);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy thông tin sách!</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Quay lại danh sách</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const isOutOfStock = remaining <= 0;
  const canBorrow = !isOutOfStock;
  const canReturn = book.borrowed > 0;

  // Xử lý Cho mượn
  const handleBorrow = async () => {
    if (!canBorrow) return;
    const success = await borrowBook(book.id);
    if (success) {
      Alert.alert('Thành công', `Đã cho mượn 1 cuốn "${book.title}".`);
    }
  };

  // Xử lý Nhận trả
  const handleReturn = async () => {
    if (!canReturn) return;
    const success = await returnBook(book.id);
    if (success) {
      Alert.alert('Thành công', `Đã nhận trả 1 cuốn "${book.title}".`);
    }
  };

  // Xử lý Xoá sách
  const handleDelete = () => {
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xoá',
        `Sách "${book.title}" đang có ${book.borrowed} cuốn đang được mượn. Không thể xoá!`
      );
      return;
    }

    Alert.alert(
      'Xác nhận xoá sách',
      `Bạn có chắc chắn muốn xoá cuốn sách "${book.title}" khỏi thư viện không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteBook(book.id);
            if (success) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Thẻ thông tin chính */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{book.category}</Text>
            </View>
            <View
              style={[
                styles.stockBadge,
                isOutOfStock ? styles.stockBadgeEmpty : styles.stockBadgeAvailable,
              ]}
            >
              <Text
                style={[
                  styles.stockBadgeText,
                  isOutOfStock ? styles.stockTextEmpty : styles.stockTextAvailable,
                ]}
              >
                {isOutOfStock ? 'Hết sách' : 'Còn sách'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>Tác giả: {book.author}</Text>

          <View style={styles.divider} />

          {/* Bảng chi tiết thông số */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã sách (ID):</Text>
            <Text style={styles.infoValue}>{book.id}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Năm xuất bản:</Text>
            <Text style={styles.infoValue}>{book.year}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tổng số cuốn:</Text>
            <Text style={styles.infoValue}>{book.quantity}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Đang được mượn:</Text>
            <Text style={[styles.infoValue, styles.borrowedValue]}>
              {book.borrowed}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số cuốn còn lại:</Text>
            <Text
              style={[
                styles.infoValue,
                styles.remainingValue,
                isOutOfStock && styles.remainingZero,
              ]}
            >
              {remaining}
            </Text>
          </View>
        </View>

        {/* Nghiệp vụ Mượn / Trả (Câu 4) */}
        <View style={styles.actionCard}>
          <Text style={styles.actionSectionTitle}>Thao tác Mượn / Trả</Text>
          <View style={styles.actionButtonsRow}>
            {/* Nút Cho mượn - vô hiệu hoá khi hết sách */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.borrowButton,
                !canBorrow && styles.buttonDisabled,
              ]}
              onPress={handleBorrow}
              disabled={!canBorrow}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  !canBorrow && styles.buttonTextDisabled,
                ]}
              >
                Cho mượn
              </Text>
            </TouchableOpacity>

            {/* Nút Nhận trả - vô hiệu hoá khi borrowed = 0 */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.returnButton,
                !canReturn && styles.buttonDisabled,
              ]}
              onPress={handleReturn}
              disabled={!canReturn}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  !canReturn && styles.buttonTextDisabled,
                ]}
              >
                Nhận trả
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Các thao tác Quản lý: Sửa và Xoá */}
        <View style={styles.managementRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('BookForm', { book })}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Sửa thông tin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Xoá sách</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  stockBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  stockBadgeAvailable: {
    backgroundColor: colors.successLight,
  },
  stockBadgeEmpty: {
    backgroundColor: colors.errorLight,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stockTextAvailable: {
    color: colors.success,
  },
  stockTextEmpty: {
    color: colors.error,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 28,
    marginBottom: spacing.xs,
  },
  author: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  borrowedValue: {
    color: colors.warning,
  },
  remainingValue: {
    color: colors.success,
    fontWeight: '700',
  },
  remainingZero: {
    color: colors.error,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borrowButton: {
    backgroundColor: colors.primary,
  },
  returnButton: {
    backgroundColor: colors.secondary,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  buttonTextDisabled: {
    color: colors.disabledText,
  },
  managementRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  editButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 10,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
