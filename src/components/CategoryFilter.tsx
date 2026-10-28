import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { BookCategory, CATEGORIES } from '../types';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const filterList = ['Tất cả', ...CATEGORIES];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {filterList.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.badge, isSelected && styles.badgeActive]}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.badgeText, isSelected && styles.badgeTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 46,
    marginVertical: spacing.xs,
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  badgeTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
});
