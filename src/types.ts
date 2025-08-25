// Main interfaces for the Vue3 Form Wizard package

export interface Tab {
  tabId: string;
  title: string;
  active: boolean;
  checked: boolean;
  validationError: string | null;
  beforeChange?: () => boolean | Promise<boolean>;
  afterChange?: () => void;
  route?: string | object;
  color: string;
  errorColor: string;
  shape: string;
  icon?: string;
  customIcon?: string;
}

export interface FormWizardProps {
  id?: string;
  title?: string;
  subtitle?: string;
  nextButtonText?: string;
  backButtonText?: string;
  finishButtonText?: string;
  hideButtons?: boolean;
  validateOnBack?: boolean;
  color?: string;
  errorColor?: string;
  shape?: string;
  layout?: string;
  stepsClasses?: string | string[];
  stepSize?: 'xs' | 'sm' | 'md' | 'lg';
  transition?: string;
  startIndex?: number;
  disableBackOnClickStep?: boolean;
  disableBack?: boolean;
}

export interface FormWizardEmits {
  (e: 'on-change', prevIndex: number, nextIndex: number): void;
  (e: 'update:startIndex', index: number): void;
  (e: 'on-complete'): void;
  (e: 'on-loading', loading: boolean): void;
  (e: 'on-error', error: any): void;
  (e: 'on-validate', result: boolean, index: number): void;
}

export interface WizardStepProps {
  tab: {
    active: boolean;
    checked: boolean;
    validationError?: string | null;
    color: string;
    errorColor: string;
    shape: string;
    icon?: string;
    customIcon?: string;
    title: string;
    tabId: string;
  };
  transition?: string;
  index?: number;
  disableBackOnClickStep?: boolean;
}

export interface TabContentProps {
  title?: string;
  icon?: string;
  customIcon?: string;
  lazy?: boolean;
  beforeChange?: () => boolean | Promise<boolean>;
  afterChange?: () => void;
  route?: string | object;
  additionalInfo?: Record<string, any>;
}

// Slot props interfaces
export interface FormWizardSlotProps {
  nextTab: () => void;
  prevTab: () => void;
  activeTabIndex: number;
  isLastStep: boolean;
  fillButtonStyle: Record<string, string>;
}

// Helper function types
export interface HelperFunctions {
  getFocusedElementId(): string;
  getFocusedTabIndex(tabs: Tab[]): number;
  findElementAndFocus(elemId: string): void;
  isPromise(func: any): boolean;
}
