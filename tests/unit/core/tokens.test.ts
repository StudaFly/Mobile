import { colors } from '../../../src/design-system/tokens/colors';
import { spacing } from '../../../src/design-system/tokens/spacing';
import { radii } from '../../../src/design-system/tokens/radii';
import { typography } from '../../../src/design-system/tokens/typography';
import { shadows } from '../../../src/design-system/tokens/shadows';

describe('design system tokens', () => {
  describe('colors', () => {
    it('has correct brand colors', () => {
      expect(colors.darkBlue).toBe('#213458');
      expect(colors.blue).toBe('#33518A');
      expect(colors.gold).toBe('#CC9C40');
      expect(colors.goldLight).toBe('#FFCB5C');
    });

    it('has correct background colors', () => {
      expect(colors.bg).toBe('#F9FAFB');
      expect(colors.bgB2B).toBe('#F0F4FA');
      expect(colors.white).toBe('#FFFFFF');
    });

    it('has correct semantic colors', () => {
      expect(colors.success).toBe('#22C55E');
      expect(colors.danger).toBe('#EF4444');
      expect(colors.warning).toBe('#F59E0B');
    });
  });

  describe('spacing', () => {
    it('follows 4px scale', () => {
      expect(spacing.xs).toBe(4);
      expect(spacing.sm).toBe(8);
      expect(spacing.md).toBe(16);
      expect(spacing.lg).toBe(24);
      expect(spacing.xl).toBe(32);
      expect(spacing.xxl).toBe(48);
    });
  });

  describe('radii', () => {
    it('has correct border radius values', () => {
      expect(radii.sm).toBe(8);
      expect(radii.md).toBe(12);
      expect(radii.lg).toBe(16);
      expect(radii.full).toBe(9999);
    });
  });

  describe('typography', () => {
    it('uses DM Sans font family', () => {
      expect(typography.fontFamily).toBe('DMSans');
    });

    it('has heading variants with correct sizes', () => {
      expect(typography.variants.heading1.fontSize).toBe(32);
      expect(typography.variants.heading2.fontSize).toBe(24);
      expect(typography.variants.heading3.fontSize).toBe(20);
    });

    it('has body variants', () => {
      expect(typography.variants.body.fontSize).toBe(16);
      expect(typography.variants.bodyMedium.fontSize).toBe(16);
    });

    it('has small variants', () => {
      expect(typography.variants.caption.fontSize).toBe(13);
      expect(typography.variants.label.fontSize).toBe(13);
    });
  });

  describe('shadows', () => {
    it('has sm, md, lg shadow definitions', () => {
      expect(shadows.sm).toBeDefined();
      expect(shadows.md).toBeDefined();
      expect(shadows.lg).toBeDefined();
    });
  });
});
