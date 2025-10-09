import api from './api';
import { SubscriptionPlan, PaymentIntent, UserSubscription } from '../types/auth';

class SubscriptionService {
  private baseUrl = '/subscriptions';

  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await api.get<{ data: { plans: SubscriptionPlan[] } }>(`${this.baseUrl}/plans`);
      return response.data.data.plans;
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch subscription plans');
    }
  }

  async createSubscription(priceId: string): Promise<PaymentIntent> {
    try {
      const response = await api.post<{ data: PaymentIntent }>(`${this.baseUrl}/create`, {
        priceId
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      throw new Error(error.response?.data?.message || 'Failed to create subscription');
    }
  }

  async confirmSubscription(subscriptionId: string, paymentMethodId?: string): Promise<UserSubscription> {
    try {
      const response = await api.post<{ data: { subscription: UserSubscription } }>(`${this.baseUrl}/confirm`, {
        subscriptionId,
        paymentMethodId
      });
      return response.data.data.subscription;
    } catch (error: any) {
      console.error('Error confirming subscription:', error);
      throw new Error(error.response?.data?.message || 'Failed to confirm subscription');
    }
  }

  async getCurrentSubscription(): Promise<UserSubscription | null> {
    try {
      const response = await api.get<{ data: { subscription: UserSubscription | null } }>(`${this.baseUrl}/current`);
      return response.data.data.subscription;
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  async cancelSubscription(): Promise<{ success: boolean }> {
    try {
      await api.post(`${this.baseUrl}/cancel`);
      return { success: true };
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }
}

export default new SubscriptionService();