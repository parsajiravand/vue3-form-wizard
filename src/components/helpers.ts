interface Tab {
  tabId: string;
  [key: string]: any;
}

export function getFocusedElementId(): string {
  return (document.activeElement as HTMLElement)?.id || '';
}

export function getFocusedTabIndex(tabs: Tab[] = []): number {
  const activeId = getFocusedElementId();
  const tabIndex = tabs.findIndex(tab => tab.tabId === activeId);
  return tabIndex;
}

export function findElementAndFocus(elemId: string): void {
  const elem = document.getElementById(elemId);
  if (elem) {
    elem.focus();
  }
}

export function isPromise(func: any): boolean {
  return func && typeof func.then === 'function';
}
