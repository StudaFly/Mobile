import { renderHook, act } from '@testing-library/react-native';
import { useOnboarding } from '../../../src/features/auth/hooks/useOnboarding';

describe('useOnboarding', () => {
  it('starts at step 0', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.step).toBe(0);
  });

  describe('next', () => {
    it('increments step by 1', () => {
      const { result } = renderHook(() => useOnboarding());
      act(() => result.current.next());
      expect(result.current.step).toBe(1);
    });

    it('increments multiple times', () => {
      const { result } = renderHook(() => useOnboarding());
      act(() => {
        result.current.next();
        result.current.next();
        result.current.next();
      });
      expect(result.current.step).toBe(3);
    });
  });

  describe('prev', () => {
    it('decrements step', () => {
      const { result } = renderHook(() => useOnboarding());
      act(() => result.current.next());
      act(() => result.current.next());
      act(() => result.current.prev());
      expect(result.current.step).toBe(1);
    });

    it('does not go below 0', () => {
      const { result } = renderHook(() => useOnboarding());
      act(() => result.current.prev());
      expect(result.current.step).toBe(0);
    });
  });
});
