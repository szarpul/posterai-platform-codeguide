import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log('🔍 OrderSuccessPage - orderId:', orderId);
        console.log('🔍 OrderSuccessPage - user:', user);
        
        if (!user) {
          console.log('🔍 OrderSuccessPage - No user, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('🔍 OrderSuccessPage - Fetching order data...');
        const orderData = await paymentService.getOrder(orderId);
        console.log('🔍 OrderSuccessPage - Order data received:', orderData);
        setOrder(orderData);
      } catch (err) {
        console.error('🔍 OrderSuccessPage - Error fetching order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light p-6 flex items-center justify-center">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-light p-6 flex items-center justify-center">
        <div className="text-error text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
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

  return (
    <div className="min-h-screen bg-neutral-light p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been placed and payment has been processed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Order ID:</span>
                  <span className="text-gray-600">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'in_production' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Size:</span>
                  <span>{order.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Finish:</span>
                  <span>{order.finish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-semibold">${(order.amount_cents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Order Date:</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <p className="font-medium">{order.shipping_address?.name}</p>
                <p>{order.shipping_address?.line1}</p>
                <p>{order.shipping_address?.city}, {order.shipping_address?.postalCode}</p>
                <p>{order.shipping_address?.country}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-gray-600">Your order has been received and confirmed.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">In Production</p>
                    <p className="text-gray-600">Your poster is being printed with high-quality materials.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-gray-600">Your poster will be shipped to your address.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Poster Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Poster</h2>
              {order.drafts && (
                <img
                  src={order.drafts.image_url}
                  alt="Poster preview"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/drafts')}
                  className="btn-primary w-full"
                >
                  View All Drafts
                </button>
                <button
                  onClick={() => navigate('/questionnaire')}
                  className="btn-secondary w-full"
                >
                  Create Another Poster
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 