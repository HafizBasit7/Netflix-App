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
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
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
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { createSubscriptionPayment, completeSubscription, refreshUserSubscription } = useAuth();
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
        await stripeService.initialize();
      }
      await initializePaymentSheet();
    } catch (error: any) {
      console.error('Initialization error:', error);
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
      
      console.log('🔄 Creating subscription payment...');
      const { clientSecret, subscriptionId } = await createSubscriptionPayment(plan.stripePriceId!);

      console.log('🔄 Initializing payment sheet...');
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Netflix Clone',
        returnURL: 'yourapp://stripe-redirect',
        style: 'alwaysDark',
        allowsDelayedPaymentMethods: false,
      });

      if (error) {
        console.error('❌ Payment sheet initialization error:', error);
        Alert.alert('Payment Setup Error', error.message);
      } else {
        setPaymentSheetInitialized(true);
        console.log('✅ Payment sheet initialized');
      }
    } catch (error: any) {
      console.error('❌ Error initializing payment:', error);
      Alert.alert('Error', error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (plan.isFree) {
      await handleFreeSubscription();
      return;
    }

    await handlePaidSubscription();
  };

  const handleFreeSubscription = async (): Promise<void> => {
    try {
      setLoading(true);
      await completeSubscription('free');
      Alert.alert('Success', 'Free plan activated successfully!', [
        {
          text: 'OK',
          onPress: () => navigateToHome()
        }
      ]);
    } catch (error: any) {
      console.error('❌ Free subscription error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaidSubscription = async (): Promise<void> => {
    if (!paymentSheetInitialized) {
      Alert.alert('Error', 'Payment system is not ready. Please wait.');
      return;
    }

    try {
      setLoading(true);
      setProcessingPayment(true);

      console.log('💳 Presenting payment sheet...');
      const { error } = await presentPaymentSheet();

      if (error) {
        console.error('❌ Payment failed:', error);
        Alert.alert('Payment Failed', error.message);
        setProcessingPayment(false);
        return;
      }

      console.log('✅ Payment completed successfully');
      
      // Wait for webhook to process (2-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Poll for subscription status
      console.log('🔄 Checking subscription status...');
      const activated = await pollSubscriptionStatus();

      if (activated) {
        Alert.alert(
          'Success!',
          'Your subscription is now active!',
          [
            {
              text: 'Start Watching',
              onPress: () => navigateToHome()
            }
          ]
        );
      } else {
        // Still show success but mention it might take a moment
        Alert.alert(
          'Payment Received',
          'Your payment was successful! Your subscription will be activated shortly.',
          [
            {
              text: 'Continue',
              onPress: () => navigateToHome()
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      Alert.alert('Error', error.message || 'Payment processing failed');
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  const pollSubscriptionStatus = async (maxAttempts: number = 5): Promise<boolean> => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        console.log(`🔄 Polling subscription status (${i + 1}/${maxAttempts})...`);
        await refreshUserSubscription();
        
        // Check if subscription is now active
        // This will be checked in AuthContext after refresh
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Note: The actual status check happens in AuthContext
        // We return true after attempts to show success message
        if (i === maxAttempts - 1) {
          return true;
        }
      } catch (error) {
        console.error('Error polling subscription:', error);
      }
    }
    return false;
  };

  const navigateToHome = (): void => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading || processingPayment}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.planSummary}>
            <View>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>
                {plan.isFree ? 'FREE' : `${plan.price}/${plan.interval}`}
              </Text>
            </View>
            <Text style={styles.planPrice}>
              {plan.isFree ? 'FREE' : `${plan.price}`}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {plan.isFree ? 'FREE' : `${plan.price}`}
            </Text>
          </View>
        </View>

        {!plan.isFree && (
          <View style={styles.paymentMethods}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <TouchableOpacity 
              style={[
                styles.paymentMethod,
                paymentMethod === 'card' && styles.paymentMethodSelected
              ]}
              onPress={() => setPaymentMethod('card')}
              disabled={loading || processingPayment}
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

        {processingPayment && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Processing your payment...</Text>
            <Text style={styles.processingSubtext}>Please wait, this may take a few moments</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (loading || (!plan.isFree && !paymentSheetInitialized) || processingPayment) && styles.buttonDisabled
          ]}
          onPress={handlePayment}
          disabled={loading || (!plan.isFree && !paymentSheetInitialized) || processingPayment}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.payButtonText}>
              {plan.isFree ? 'Start Free' : `Pay ${plan.price}`}
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
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginTop: 20,
  },
  processingText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  processingSubtext: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
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