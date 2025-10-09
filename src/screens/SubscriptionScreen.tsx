import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { SubscriptionPlan } from '../types/auth';
import subscriptionService from '../services/subscriptionService';

const SubscriptionScreen: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  
  const { user, completeSubscription } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async (): Promise<void> => {
    try {
      const subscriptionPlans = await subscriptionService.getPlans();
      setPlans(subscriptionPlans);
      
      // Select free plan by default
      const freePlan = subscriptionPlans.find(plan => plan.isFree);
      if (freePlan) {
        setSelectedPlan(freePlan);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load subscription plans');
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan): void => {
    setSelectedPlan(plan);
  };

  const handleContinue = async (): Promise<void> => {
    if (!selectedPlan) return;

    setProcessing(true);

    try {
      if (selectedPlan.isFree) {
        // For free plan, just complete subscription and move to main tabs
        await completeSubscription('free');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
      } else {
        // For paid plans, navigate to payment screen
        navigation.navigate('Payment' as never, { 
          plan: selectedPlan 
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to process subscription');
    } finally {
      setProcessing(false);
    }
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      
      {/* Header */}
      <View style={styles.header}>
    
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          {user?.email ? `Signed up as ${user.email}` : 'Start your journey with us'}
        </Text>
      </View>

      {/* Plans */}
      <ScrollView 
        style={styles.plansContainer}
        showsVerticalScrollIndicator={false}
      >
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan?.id === plan.id && styles.planCardSelected
            ]}
            onPress={() => handlePlanSelect(plan)}
            disabled={processing}
          >
            <View style={styles.planHeader}>
              <View style={styles.planSelection}>
                <View style={[
                  styles.radio,
                  selectedPlan?.id === plan.id && styles.radioSelected
                ]}>
                  {selectedPlan?.id === plan.id && (
                    <Icon name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.planName}>{plan.name}</Text>
              </View>
              
              <View style={styles.priceContainer}>
                {plan.isFree ? (
                  <Text style={styles.priceFree}>FREE</Text>
                ) : (
                  <>
                    <Text style={styles.price}>${plan.price}</Text>
                    <Text style={styles.interval}>/{plan.interval}</Text>
                  </>
                )}
              </View>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <Icon 
                    name="checkmark-circle" 
                    size={20} 
                    color={colors.primary} 
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Popular Badge */}
            {plan.name.toLowerCase().includes('premium') && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedPlan || processing) && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedPlan || processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.continueButtonText}>
              {selectedPlan?.isFree ? 'Start Free' : `Continue to Payment`}
            </Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.footerText}>
          {selectedPlan?.isFree 
            ? 'No payment required. Start using the app immediately.'
            : 'You will be redirected to secure payment processing.'
          }
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  plansContainer: {
    flex: 1,
    padding: 16,
  },
  planCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.cardBackground + '40', // Add transparency
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planSelection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textMuted,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  planName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceFree: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  interval: {
    color: colors.textMuted,
    fontSize: 16,
    marginLeft: 4,
  },
  featuresContainer: {
    marginTop: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: colors.text,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.cardBackground,
  },
  continueButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default SubscriptionScreen;