import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';
import stripePromise from '../lib/stripe';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm = ({ order, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (paymentError) {
      setError(paymentError.message);
      setProcessing(false);
    } else {
      if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setError(null);
        setProcessing(false);
        // Redirect to success page after a short delay
        setTimeout(() => {
          navigate(`/order-success/${order.id}`);
        }, 2000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!stripe || processing || succeeded}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : succeeded ? 'Payment Successful!' : 'Pay Now'}
          </button>
        </div>
      </div>
    </form>
  );
};

const CheckoutPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        // Get order details
        const orderData = await paymentService.getOrder(orderId);
        setOrder(orderData);

        // Create payment intent
        const { clientSecret: secret } = await paymentService.createPaymentIntent(orderId);
        setClientSecret(secret);
      } catch (err) {
        setError(err.message);
        console.error('Checkout initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light p-6 flex items-center justify-center">
        <div className="text-lg">Loading checkout...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-light p-6 flex items-center justify-center">
        <div className="text-error text-center">
          <h2 className="text-xl font-semibold mb-2">Checkout Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/drafts')}
            className="btn-secondary mt-4"
          >
            Back to Drafts
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-neutral-light p-6 flex items-center justify-center">
        <div className="text-error">Unable to initialize payment. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <button
            onClick={() => navigate('/drafts')}
            className="btn-secondary"
          >
            Back to Drafts
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{order.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Finish:</span>
                  <span>{order.finish}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Address:</span>
                  <span className="text-right">
                    {order.shipping_address?.name}<br />
                    {order.shipping_address?.line1}<br />
                    {order.shipping_address?.city}, {order.shipping_address?.postalCode}<br />
                    {order.shipping_address?.country}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${(order.amount_cents / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.drafts && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Poster Preview</h2>
                <img
                  src={order.drafts.image_url}
                  alt="Poster preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Payment Form */}
          <div>
            <Elements stripe={stripePromise}>
              <CheckoutForm order={order} clientSecret={clientSecret} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 