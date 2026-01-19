type Cleanup = () => void;

type LifecycleStore = {
  cleanups: Set<Cleanup>;
  inited: WeakMap<Element, Set<string>>;
};

const store = ((globalThis as unknown as { __uiLifecycle?: LifecycleStore }).__uiLifecycle ??=
  {
    cleanups: new Set<Cleanup>(),
    inited: new WeakMap<Element, Set<string>>(),
  }) as LifecycleStore;

function markInitialized(el: Element, key: string): boolean {
  const existing = store.inited.get(el);
  if (existing && existing.has(key)) return false;
  const next = existing ?? new Set<string>();
  next.add(key);
  store.inited.set(el, next);
  return true;
}

function registerCleanup(cleanup: Cleanup | Cleanup[] | void) {
  if (!cleanup) return;
  if (Array.isArray(cleanup)) {
    cleanup.forEach((item) => store.cleanups.add(item));
    return;
  }
  store.cleanups.add(cleanup);
}

export function initOnce(
  el: Element | null,
  key: string,
  init: (el: Element) => Cleanup | Cleanup[] | void
) {
  if (!el) return;
  if (!markInitialized(el, key)) return;
  registerCleanup(init(el));
}

export function runCleanups() {
  store.cleanups.forEach((cleanup) => {
    try {
      cleanup();
    } catch {
      // Best-effort cleanup; ignore failures to avoid blocking navigation.
    }
  });
  store.cleanups.clear();
}
