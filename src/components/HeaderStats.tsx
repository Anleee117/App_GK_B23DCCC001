import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';

interface HeaderStatsProps {
  totalTitles: number;
  totalBorrowed: number;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({ totalTitles, totalBorrowed }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.cardLeft]}>
        <Text style={styles.label}>Tổng đầu sách</Text>
        <Text style={styles.value}>{totalTitles}</Text>
      </View>
      <View style={[styles.card, styles.cardRight]}>
        <Text style={styles.label}>Đang cho mượn</Text>
        <Text style={[styles.value, styles.borrowedValue]}>{totalBorrowed}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLeft: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardRight: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  borrowedValue: {
    color: colors.warning,
  },
});
