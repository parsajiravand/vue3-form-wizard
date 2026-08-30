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

/**
 * `root` scopes the lookup to one wizard. Step ids only have to be unique
 * within a wizard, so a page with several wizards would otherwise focus the
 * first matching step in the document rather than the one being navigated.
 */
export function findElementAndFocus(elemId: string, root?: HTMLElement | null): void {
  if (typeof document === 'undefined') {
    return;
  }

  const elem = root
    ? Array.from(root.querySelectorAll<HTMLElement>('[id]')).find(
        (candidate) => candidate.id === elemId
      )
    : document.getElementById(elemId);

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
