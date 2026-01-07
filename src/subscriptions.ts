import { Platform } from 'react-native';

type PurchaseResult = { success: boolean; message?: string; entitlementActive?: boolean };

export const PRODUCT_ID_PLUS = 'cs_plus_monthly_099';

// Avoid In dev evitiamo di toccare l'IAP reale (emulator Android o simulatore iOS senza store).
const SHOULD_BYPASS_IAP = __DEV__;

type IapModule =
  | {
      initConnection: () => Promise<boolean>;
      endConnection: () => Promise<void>;
      getSubscriptions: (ids: string[]) => Promise<any[]>;
      requestSubscription: (params: { sku: string }) => Promise<void>;
      getAvailablePurchases: () => Promise<any[]>;
      finishTransaction: (purchase: any, consume?: boolean) => Promise<void>;
    }
  | null
  | undefined;

function loadModule(): IapModule {
  if (SHOULD_BYPASS_IAP) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-iap');
  } catch {
    return null;
  }
}

export async function initIap(): Promise<{ ready: boolean; isMock: boolean }> {
  const RNIap = loadModule();
  if (!RNIap) {
    return { ready: true, isMock: true };
  }
  try {
    const connected = await RNIap.initConnection();
    return { ready: connected, isMock: false };
  } catch (err) {
    console.warn('[IAP] initConnection failed, falling back to mock', err);
    return { ready: true, isMock: true };
  }
}

export async function fetchPlusProduct(): Promise<{ price: string; title: string } | null> {
  const RNIap = loadModule();
  if (!RNIap) return { price: '€0.99', title: 'CallShield Plus' };
  try {
    const products = await RNIap.getSubscriptions([PRODUCT_ID_PLUS]);
    if (!products || !products.length) return null;
    const p = products[0];
    return { price: p.localizedPrice || p.price || '€0.99', title: p.title || 'CallShield Plus' };
  } catch (err) {
    console.warn('[IAP] getSubscriptions failed, using fallback product', err);
    return { price: '€0.99', title: 'CallShield Plus' };
  }
}

export async function purchasePlus(): Promise<PurchaseResult> {
  const RNIap = loadModule();
  if (!RNIap) {
    return { success: true, message: 'Mock purchase activated', entitlementActive: true };
  }
  try {
    await RNIap.requestSubscription({ sku: PRODUCT_ID_PLUS });
    // Real-world: listen to purchaseUpdated listener and finishTransaction. Here we optimistically return.
    return { success: true, entitlementActive: true };
  } catch (err: any) {
    console.warn('[IAP] requestSubscription failed', err);
    return { success: false, entitlementActive: false, message: err?.message || 'Purchase failed' };
  }
}

export async function restorePurchases(): Promise<PurchaseResult> {
  const RNIap = loadModule();
  if (!RNIap) {
    return { success: true, message: 'Mock restore', entitlementActive: true };
  }
  try {
    const purchases = await RNIap.getAvailablePurchases();
    const hasPlus = purchases?.some((p: any) => p.productId === PRODUCT_ID_PLUS);
    if (hasPlus) {
      // Finish the transaction to clear native queues if needed.
      await Promise.all(
        purchases.map((p: any) =>
          RNIap.finishTransaction(p, false).catch(() => {
            // ignore finish failures in restore path
          }),
        ),
      );
      return { success: true, entitlementActive: true };
    }
    return { success: false, entitlementActive: false, message: 'No active Plus subscription found' };
  } catch (err: any) {
    console.warn('[IAP] getAvailablePurchases failed', err);
    return { success: false, entitlementActive: false, message: 'Restore failed' };
  }
}

export async function cleanupIap(): Promise<void> {
  const RNIap = loadModule();
  if (!RNIap) return;
  await RNIap.endConnection();
}

export function platformSupportsIap(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}
