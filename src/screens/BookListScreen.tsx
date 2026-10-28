import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Book } from '../types';
import { useBooks } from '../context/BookContext';
import { HeaderStats } from '../components/HeaderStats';
import { CategoryFilter } from '../components/CategoryFilter';
import { BookCard } from '../components/BookCard';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookList'>;

export const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const { books, loading, deleteBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Thống kê tổng đầu sách và tổng số cuốn đang mượn
  const totalTitles = books.length;
  const totalBorrowed = useMemo(() => {
    return books.reduce((sum, b) => sum + b.borrowed, 0);
  }, [books]);

  // Tìm kiếm và lọc đồng thời
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Lọc theo thể loại
      const matchesCategory =
        selectedCategory === 'Tất cả' || book.category === selectedCategory;

      // Tìm kiếm theo tên hoặc tác giả (không phân biệt chữ hoa/thường)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  // Xử lý xoá sách khi nhấn giữ (onLongPress)
  const handleDeleteBook = (book: Book) => {
    // Câu 3: Không cho xoá sách đang có người mượn (borrowed > 0), báo lỗi bằng Alert
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xoá',
        `Sách "${book.title}" đang có ${book.borrowed} cuốn đang được mượn. Không thể xoá!`
      );
      return;
    }

    // Câu 3 & Quy định chung: Mọi thao tác xoá phải hỏi xác nhận bằng Alert
    Alert.alert(
      'Xác nhận xoá sách',
      `Bạn có chắc chắn muốn xoá cuốn sách "${book.title}" khỏi thư viện không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => deleteBook(book.id),
        },
      ]
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Không tìm thấy sách</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery.trim() !== '' || selectedCategory !== 'Tất cả'
          ? 'Không có cuốn sách nào khớp với tìm kiếm/lọc hiện tại.'
          : 'Hiện chưa có cuốn sách nào trong thư viện.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        {/* Thống kê đầu trang (Câu 1) */}
        <HeaderStats totalTitles={totalTitles} totalBorrowed={totalBorrowed} />

        {/* Ô tìm kiếm và nút "+ Thêm sách" (Câu 2, Câu 5) */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên sách hoặc tác giả..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('BookForm', {})}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {/* Hàng nút lọc theo thể loại (Câu 5) */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Danh sách sách (Câu 1) */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
                onLongPress={() => handleDeleteBook(item)}
              />
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyComponent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    height: 44,
  },
  searchInput: {
    fontSize: 14,
    color: colors.text,
    paddingVertical: 0,
  },
  addButton: {
    backgroundColor: colors.primary,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
