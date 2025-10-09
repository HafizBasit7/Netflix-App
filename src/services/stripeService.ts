// services/stripeService.ts
import { initStripe } from '@stripe/stripe-react-native';

class StripeService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Use the test publishable key from your backend config
      await initStripe({
        publishableKey: 'pk_test_51SFuY5H3dNEjQBO1XQnpsHN57FzzjMDGm1Y6L0cKIChKSU6L0GhySCylbn9EV3eecJbIcOTPzzkCbtUIFYrM3nbG00tLsiPudh',
        merchantIdentifier: 'merchant.com.yourapp', // Optional for Apple Pay
      });
      this.isInitialized = true;
      console.log('Stripe initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      throw error;
    }
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

export default new StripeService();