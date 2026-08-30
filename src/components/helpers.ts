interface Tab {
  tabId: string;
  [key: string]: any;
}

export function getFocusedElementId(): string {
  if (typeof document === 'undefined' || !document.activeElement) {
    return '';
  }
  return (document.activeElement as HTMLElement).id || '';
}

export function getFocusedTabIndex(tabs: Tab[] = []): number {
  const activeId = getFocusedElementId();
  const tabIndex = tabs.findIndex(tab => `step-${tab.tabId}` === activeId);
  return tabIndex;
}

export function findElementAndFocus(elemId: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  const elem = document.getElementById(elemId);
  if (elem) {
    elem.focus();
  }
}

export function isPromise(func: any): boolean {
  return func && typeof func.then === 'function';
}

let wizardInstanceCounter = 0;

/**
 * Module-scoped so every FormWizard on the page gets a distinct id.
 * Keeping the counter inside `<script setup>` would reset it per instance.
 */
export function nextWizardId(): string {
  return `fw_${++wizardInstanceCounter}`;
}

/** Make an arbitrary step title safe to use inside a DOM id / CSS selector. */
export function slugifyTabTitle(title: string): string {
  return (
    (title || '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'step'
  );
}
