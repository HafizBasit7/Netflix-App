import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { SubscriptionPlan } from '../types/auth';
import stripeService from '../services/stripeService';

const PaymentScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [paymentSheetInitialized, setPaymentSheetInitialized] = useState<boolean>(false);
  
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { createSubscriptionPayment, completeSubscription } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  
  const { plan } = route.params as { plan: SubscriptionPlan };

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async (): Promise<void> => {
    try {
      if (!plan.isFree) {
        // Initialize Stripe for paid plans
        await stripeService.initialize();
      }
      await initializePaymentSheet();
    } catch (error: any) {
      Alert.alert('Initialization Error', error.message);
    }
  };

  const initializePaymentSheet = async (): Promise<void> => {
    if (plan.isFree) {
      setPaymentSheetInitialized(true);
      return;
    }

    try {
      setLoading(true);
      
      // Create subscription and get client secret from your backend
      const { clientSecret, subscriptionId } = await createSubscriptionPayment(plan.stripePriceId!);

      console.log('Initializing payment sheet with client secret:', clientSecret);

      // Initialize payment sheet
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Netflix Clone',
        returnURL: 'yourapp://stripe-redirect',
        style: 'alwaysDark',
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          email: 'customer@example.com',
        }
      });

      if (error) {
        console.error('Payment sheet initialization error:', error);
        Alert.alert('Payment Setup Error', error.message);
      } else {
        setPaymentSheetInitialized(true);
        console.log('Payment sheet initialized successfully');
      }
    } catch (error: any) {
      console.error('Error in payment sheet initialization:', error);
      Alert.alert('Error', error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (plan.isFree) {
      // Handle free plan
      try {
        setLoading(true);
        await completeSubscription('free');
        Alert.alert('Success', 'Free plan activated successfully!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Handle paid plan
    if (!paymentSheetInitialized) {
      Alert.alert('Error', 'Payment system is not ready. Please wait a moment.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Payment Failed`, error.message);
      } else {
        // Payment successful
        Alert.alert('Success', 'Your subscription is confirmed!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.planSummary}>
            <View>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>
                {plan.isFree ? 'FREE' : `$${plan.price}/${plan.interval}`}
              </Text>
            </View>
            <Text style={styles.planPrice}>
              {plan.isFree ? 'FREE' : `$${plan.price}`}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {plan.isFree ? 'FREE' : `$${plan.price}`}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        {!plan.isFree && (
          <View style={styles.paymentMethods}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <TouchableOpacity 
              style={[
                styles.paymentMethod,
                paymentMethod === 'card' && styles.paymentMethodSelected
              ]}
              onPress={() => setPaymentMethod('card')}
              disabled={loading}
            >
              <View style={styles.paymentMethodInfo}>
                <Icon name="card" size={24} color={colors.text} />
                <Text style={styles.paymentMethodText}>Credit or Debit Card</Text>
              </View>
              <Icon 
                name={paymentMethod === 'card' ? 'radio-button-on' : 'radio-button-off'} 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>

            {!paymentSheetInitialized && (
              <View style={styles.initializingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.initializingText}>Initializing payment...</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (loading || (!plan.isFree && !paymentSheetInitialized)) && styles.buttonDisabled
          ]}
          onPress={handlePayment}
          disabled={loading || (!plan.isFree && !paymentSheetInitialized)}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.payButtonText}>
              {plan.isFree ? 'Start Free' : `Pay $${plan.price}`}
            </Text>
          )}
        </TouchableOpacity>
        
        {!plan.isFree && (
          <Text style={styles.securityText}>
            <Icon name="lock-closed" size={12} color={colors.textMuted} />
            {' '}Your payment is secure and encrypted
          </Text>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 4,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  planSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  planPrice: {
    color: colors.textMuted,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  totalAmount: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentMethods: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 12,
  },
  initializingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  initializingText: {
    color: colors.textMuted,
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  payButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default PaymentScreen;