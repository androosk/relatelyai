import {
  initConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getSubscriptions,
  requestSubscription,
  finishTransaction,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  Purchase,
  PurchaseError,
  Subscription,
} from 'react-native-iap';
import { Platform } from 'react-native';
import { supabase } from 'api/supabase';

// Product IDs - these must match what you set up in App Store Connect
const PRODUCT_IDS = Platform.select({
  ios: [
    'com.relately.monthly',
    'com.relately.yearly',
  ],
  android: [
    'com.relately.monthly',
    'com.relately.yearly',
  ],
}) || [];

export interface SubscriptionPlan {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  subscriptionPeriod?: string;
}

class SubscriptionService {
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  async initialize() {
    try {
      await initConnection();
      
      // Flush any failed purchases on Android
      if (Platform.OS === 'android') {
        await flushFailedPurchasesCachedAsPendingAndroid();
      }

      // Set up purchase listeners
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          console.log('Purchase updated:', purchase);
          
          // Verify the purchase with your backend
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            await this.verifyPurchase(purchase);
            
            // Acknowledge the purchase
            await finishTransaction({ purchase });
          }
        }
      );

      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.error('Purchase error:', error);
        }
      );
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
    }
  }

  async getAvailableSubscriptions(): Promise<Subscription[]> {
    try {
      const subscriptions = await getSubscriptions({ skus: PRODUCT_IDS });
      return subscriptions;
    } catch (error) {
      console.error('Failed to get subscriptions:', error);
      return [];
    }
  }

  async purchaseSubscription(productId: string, offerToken?: string) {
    try {
      const purchase = await requestSubscription({
        sku: productId,
        ...(offerToken && Platform.OS === 'android' && { subscriptionOffers: [{ sku: productId, offerToken }] }),
      });
      
      return purchase;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async verifyPurchase(purchase: Purchase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Store subscription info in your database
      const { error } = await supabase.from('subscriptions').upsert({
        user_id: user.id,
        product_id: purchase.productId,
        transaction_id: purchase.transactionId,
        transaction_date: purchase.transactionDate,
        transaction_receipt: purchase.transactionReceipt,
        status: 'active',
        platform: Platform.OS,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Update user profile to reflect premium status
      await supabase.from('profiles').update({
        subscription_status: 'premium',
        subscription_type: purchase.productId.includes('yearly') ? 'yearly' : 'monthly',
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

    } catch (error) {
      console.error('Failed to verify purchase:', error);
      throw error;
    }
  }

  async restorePurchases() {
    try {
      // This will trigger purchaseUpdatedListener for each restored purchase
      const purchases = await getSubscriptions({ skus: PRODUCT_IDS });
      return purchases;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
    endConnection();
  }
}

export const subscriptionService = new SubscriptionService();