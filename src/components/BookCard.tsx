import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Book } from '../types';
import { colors, spacing } from '../theme/colors';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress, onLongPress }) => {
  const remaining = book.quantity - book.borrowed;
  const isOutOfStock = remaining <= 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      delayLongPress={400}
    >
      <View style={styles.content}>
        {/* Tiêu đề sách (Nổi bật nhất) */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          {isOutOfStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Hết sách</Text>
            </View>
          )}
        </View>

        {/* Tác giả */}
        <Text style={styles.author}>
          Tác giả: <Text style={styles.authorHighlight}>{book.author}</Text>
        </Text>

        {/* Footer của card: Thể loại & Số lượng còn lại */}
        <View style={styles.footerRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{book.category}</Text>
          </View>

          <View style={styles.remainingContainer}>
            <Text style={styles.remainingLabel}>Còn lại: </Text>
            <Text
              style={[
                styles.remainingValue,
                isOutOfStock && styles.remainingZero,
              ]}
            >
              {remaining} / {book.quantity}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs + 2,
    padding: spacing.lg,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    gap: spacing.xs + 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  outOfStockBadge: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.error,
  },
  outOfStockText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: '700',
  },
  author: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  authorHighlight: {
    color: colors.text,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  remainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remainingLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  remainingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  remainingZero: {
    color: colors.error,
  },
});
