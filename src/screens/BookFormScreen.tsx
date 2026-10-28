import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, BookCategory, CATEGORIES } from '../types';
import { useBooks } from '../context/BookContext';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

interface FormErrors {
  title?: string;
  author?: string;
  year?: string;
  quantity?: string;
}

export const BookFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const existingBook = route.params?.book;
  const isEditMode = Boolean(existingBook);

  const { addBook, updateBook } = useBooks();

  // Khởi tạo state với dữ liệu cũ khi sửa (Câu 2)
  const [title, setTitle] = useState(existingBook ? existingBook.title : '');
  const [author, setAuthor] = useState(existingBook ? existingBook.author : '');
  const [category, setCategory] = useState<BookCategory>(
    existingBook ? existingBook.category : 'Giáo trình'
  );
  const [year, setYear] = useState(existingBook ? existingBook.year.toString() : '');
  const [quantity, setQuantity] = useState(
    existingBook ? existingBook.quantity.toString() : ''
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const currentYear = new Date().getFullYear();

    // 1. Kiểm tra Tên sách
    if (!title.trim()) {
      newErrors.title = 'Tên sách không được để trống';
    }

    // 2. Kiểm tra Tác giả
    if (!author.trim()) {
      newErrors.author = 'Tác giả không được để trống';
    }

    // 3. Kiểm tra Năm xuất bản
    const trimmedYear = year.trim();
    if (!trimmedYear) {
      newErrors.year = 'Năm xuất bản không được để trống';
    } else {
      const parsedYear = Number(trimmedYear);
      if (isNaN(parsedYear) || !Number.isInteger(parsedYear)) {
        newErrors.year = 'Năm xuất bản phải là số nguyên hợp lệ';
      } else if (parsedYear < 1900 || parsedYear > currentYear) {
        newErrors.year = `Năm xuất bản phải từ 1900 đến ${currentYear}`;
      }
    }

    // 4. Kiểm tra Số lượng
    const trimmedQuantity = quantity.trim();
    if (!trimmedQuantity) {
      newErrors.quantity = 'Số lượng không được để trống';
    } else {
      const parsedQty = Number(trimmedQuantity);
      if (isNaN(parsedQty) || !Number.isInteger(parsedQty) || parsedQty <= 0) {
        newErrors.quantity = 'Số lượng phải là số nguyên lớn hơn 0';
      } else if (isEditMode && existingBook && parsedQty < existingBook.borrowed) {
        newErrors.quantity = `Số lượng không được nhỏ hơn số cuốn đang mượn (${existingBook.borrowed} cuốn)`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const parsedYear = parseInt(year.trim(), 10);
    const parsedQuantity = parseInt(quantity.trim(), 10);

    if (isEditMode && existingBook) {
      // Cập nhật sách
      await updateBook({
        ...existingBook,
        title: title.trim(),
        author: author.trim(),
        category,
        year: parsedYear,
        quantity: parsedQuantity,
      });
      Alert.alert('Thành công', 'Đã cập nhật thông tin sách thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      // Thêm sách mới
      await addBook({
        title: title.trim(),
        author: author.trim(),
        category,
        year: parsedYear,
        quantity: parsedQuantity,
        borrowed: 0, // Mặc định 0 theo đề bài
      });
      Alert.alert('Thành công', 'Đã thêm sách mới thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Thông tin chế độ */}
          <View style={styles.formCard}>
            <Text style={styles.formHeaderTitle}>
              {isEditMode ? 'Chỉnh sửa thông tin sách' : 'Điền thông tin sách mới'}
            </Text>

            {/* Ô nhập: Tên sách */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Tên sách <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Nhập tên sách..."
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Ô nhập: Tác giả */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Tác giả <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.author && styles.inputError]}
                placeholder="Nhập tên tác giả..."
                placeholderTextColor={colors.textMuted}
                value={author}
                onChangeText={(text) => {
                  setAuthor(text);
                  if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
                }}
              />
              {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
            </View>

            {/* Thể loại */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Thể loại <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        isSelected && styles.categoryOptionSelected,
                      ]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          isSelected && styles.categoryOptionTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Ô nhập: Năm xuất bản */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Năm xuất bản (1900 - {new Date().getFullYear()}){' '}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.year && styles.inputError]}
                placeholder={`Ví dụ: 2022`}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={year}
                onChangeText={(text) => {
                  setYear(text);
                  if (errors.year) setErrors((prev) => ({ ...prev, year: undefined }));
                }}
                maxLength={4}
              />
              {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
            </View>

            {/* Ô nhập: Tổng số lượng */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Tổng số cuốn (> 0) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.inputError]}
                placeholder="Ví dụ: 10"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={quantity}
                onChangeText={(text) => {
                  setQuantity(text);
                  if (errors.quantity)
                    setErrors((prev) => ({ ...prev, quantity: undefined }));
                }}
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
              {isEditMode && existingBook && (
                <Text style={styles.helperText}>
                  (Hiện đang mượn: {existingBook.borrowed} cuốn)
                </Text>
              )}
            </View>

            {/* Nút Submit */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>
                {isEditMode ? 'Lưu thay đổi' : '+ Thêm sách vào thư viện'}
              </Text>
            </TouchableOpacity>

            {/* Nút Huỷ */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Huỷ bỏ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formCard: {
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
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs + 2,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryOptionText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
