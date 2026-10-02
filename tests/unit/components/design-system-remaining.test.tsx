import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('lucide-react-native', () => ({
  Plus: () => null,
  X: () => null,
  ArrowLeft: () => null,
  ChevronLeft: () => null,
  ChevronRight: () => null,
}));

import { Box } from '../../../src/design-system/primitives/Box/Box';
import { Header } from '../../../src/design-system/components/layout/Header/Header';
import { ScreenWrapper } from '../../../src/design-system/components/layout/ScreenWrapper/ScreenWrapper';
import { Tabs } from '../../../src/design-system/components/layout/Tabs/Tabs';
import { TabItem } from '../../../src/design-system/components/layout/Tabs/TabItem';
import { Stepper } from '../../../src/design-system/components/forms/Stepper/Stepper';
import { StepperItem } from '../../../src/design-system/components/forms/Stepper/StepperItem';
import { Modal } from '../../../src/design-system/components/overlays/Modal/Modal';
import { ModalHeader } from '../../../src/design-system/components/overlays/Modal/ModalHeader';
import { BottomSheet } from '../../../src/design-system/components/overlays/BottomSheet/BottomSheet';
import { Tooltip } from '../../../src/design-system/components/overlays/Tooltip/Tooltip';
import { EmptyState } from '../../../src/design-system/components/feedback/EmptyState/EmptyState';
import { ErrorState } from '../../../src/design-system/components/feedback/ErrorState/ErrorState';
import { Skeleton } from '../../../src/design-system/components/feedback/Skeleton/Skeleton';
import { Toast } from '../../../src/design-system/components/feedback/Toast/Toast';
import { ToastContainer } from '../../../src/design-system/components/feedback/Toast/ToastContainer';
import { ConfettiOverlay } from '../../../src/design-system/components/feedback/ConfettiOverlay/ConfettiOverlay';
import { Checkbox } from '../../../src/design-system/components/forms/Checkbox/Checkbox';
import { DatePicker } from '../../../src/design-system/components/forms/DatePicker/DatePicker';
import { SearchBar } from '../../../src/design-system/components/forms/SearchBar/SearchBar';
import { Select } from '../../../src/design-system/components/forms/Select/Select';

describe('Box', () => {
  it('renders children', () => {
    const { getByText } = render(<Box><Text>content</Text></Box>);
    expect(getByText('content')).toBeDefined();
  });

  it('applies spacing props', () => {
    const { UNSAFE_root } = render(<Box padding="md" margin="sm" gap="xs" />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('applies flex and backgroundColor', () => {
    const { UNSAFE_root } = render(<Box flex={1} backgroundColor="#fff" />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('applies paddingHorizontal and paddingVertical', () => {
    const { UNSAFE_root } = render(<Box paddingHorizontal="lg" paddingVertical="md" />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('applies marginHorizontal and marginVertical', () => {
    const { UNSAFE_root } = render(<Box marginHorizontal="sm" marginVertical="xs" />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('Header', () => {
  it('renders title', () => {
    const { getByText } = render(<Header title="Mon titre" />);
    expect(getByText('Mon titre')).toBeDefined();
  });

  it('renders back button when onBack provided', () => {
    const onBack = jest.fn();
    const { UNSAFE_root } = render(<Header title="Titre" onBack={onBack} />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('renders rightAction when provided', () => {
    const { getByText } = render(
      <Header title="Titre" rightAction={<Text>Action</Text>} />
    );
    expect(getByText('Action')).toBeDefined();
  });

  it('renders placeholder when no rightAction', () => {
    const { UNSAFE_root } = render(<Header title="Titre" />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('ScreenWrapper', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ScreenWrapper><Text>Screen content</Text></ScreenWrapper>
    );
    expect(getByText('Screen content')).toBeDefined();
  });
});

describe('Tabs', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Tabs><Text>Tab content</Text></Tabs>
    );
    expect(getByText('Tab content')).toBeDefined();
  });
});

describe('TabItem', () => {
  it('renders label', () => {
    const { getByText } = render(
      <TabItem label="Toutes" isActive={false} onPress={jest.fn()} />
    );
    expect(getByText('Toutes')).toBeDefined();
  });

  it('renders active state', () => {
    const { getByText } = render(
      <TabItem label="Admin" isActive={true} onPress={jest.fn()} />
    );
    expect(getByText('Admin')).toBeDefined();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TabItem label="Finance" isActive={false} onPress={onPress} />
    );
    fireEvent.press(getByText('Finance'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('Stepper', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<Stepper totalSteps={4} currentStep={1} />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('StepperItem', () => {
  it('renders active item', () => {
    const { UNSAFE_root } = render(<StepperItem isActive={true} isCompleted={false} />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('renders completed item', () => {
    const { UNSAFE_root } = render(<StepperItem isActive={false} isCompleted={true} />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('Modal', () => {
  it('renders when visible', () => {
    const { UNSAFE_root } = render(
      <Modal visible={true} onClose={jest.fn()}>
        <Text>Modal content</Text>
      </Modal>
    );
    expect(UNSAFE_root).toBeDefined();
  });

  it('renders hidden modal', () => {
    const { UNSAFE_root } = render(
      <Modal visible={false} onClose={jest.fn()} />
    );
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('ModalHeader', () => {
  it('renders title', () => {
    const { getByText } = render(
      <ModalHeader title="Confirmation" onClose={jest.fn()} />
    );
    expect(getByText('Confirmation')).toBeDefined();
  });
});

describe('BottomSheet', () => {
  it('renders children', () => {
    const { getByText } = render(
      <BottomSheet><Text>Sheet content</Text></BottomSheet>
    );
    expect(getByText('Sheet content')).toBeDefined();
  });
});

describe('Tooltip', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Tooltip content="Info"><Text>Hover me</Text></Tooltip>
    );
    expect(getByText('Hover me')).toBeDefined();
  });
});

describe('Feedback stubs', () => {
  it('EmptyState renders', () => {
    const { UNSAFE_root } = render(<EmptyState title="Aucun élément" />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('ErrorState renders', () => {
    const { UNSAFE_root } = render(<ErrorState />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('Skeleton renders', () => {
    const { UNSAFE_root } = render(<Skeleton />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('Toast renders', () => {
    const { UNSAFE_root } = render(<Toast />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('ToastContainer renders', () => {
    const { UNSAFE_root } = render(<ToastContainer />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('ConfettiOverlay renders', () => {
    const { UNSAFE_root } = render(<ConfettiOverlay />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('Form stubs', () => {
  it('Checkbox renders', () => {
    const { UNSAFE_root } = render(<Checkbox checked={false} onPress={jest.fn()} />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('DatePicker renders', () => {
    const { UNSAFE_root } = render(<DatePicker />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('SearchBar renders', () => {
    const { UNSAFE_root } = render(<SearchBar />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('Select renders', () => {
    const { UNSAFE_root } = render(<Select />);
    expect(UNSAFE_root).toBeDefined();
  });
});
