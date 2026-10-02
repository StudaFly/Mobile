export const typography = {
  fontFamily: 'DMSans',
  variants: {
    heading1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    heading2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
    heading3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
    caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
    label: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  },
} as const;

export type TypographyVariant = keyof typeof typography.variants;
