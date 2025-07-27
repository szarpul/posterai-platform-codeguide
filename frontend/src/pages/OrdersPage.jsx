import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [deletingOrders, setDeletingOrders] = useState(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('📋 OrdersPage - User:', user);
        
        if (!user) {
          console.log('📋 OrdersPage - No user, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('📋 OrdersPage - Fetching user orders...');
        const ordersData = await paymentService.getUserOrders();
        console.log('📋 OrdersPage - Orders data received:', ordersData);
        setOrders(ordersData);
      } catch (err) {
        console.error('📋 OrdersPage - Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'in_production':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to discard this order? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingOrder(orderId);
      
      // Add to deleting set to start fade-out animation
      setDeletingOrders(prev => new Set(prev).add(orderId));
      
      // Wait for animation to complete (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await paymentService.cancelOrder(orderId);
      
      // Remove the order from the list
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.message || 'Failed to cancel order');
      // Remove from deleting set if there was an error
      setDeletingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    } finally {
      setCancellingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light p-6 flex items-center justify-center">
        <div className="text-lg">Loading orders...</div>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <button
            onClick={() => navigate('/drafts')}
            className="btn-secondary"
          >
            Back to Drafts
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/drafts')}
              className="btn-primary"
            >
              View Your Drafts
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out ${
                  deletingOrders.has(order.id) 
                    ? 'opacity-0 transform scale-95 -translate-y-2' 
                    : 'opacity-100 transform scale-100 translate-y-0'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Order Info */}
                  <div>
                    <h3 className="font-semibold mb-2">Order Details</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono">{order.id.slice(0, 8)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="font-semibold mb-2">Product</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span>{order.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Finish:</span>
                        <span>{order.finish}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold">${(order.amount_cents / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center">
                    {order.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => navigate(`/checkout/${order.id}`)}
                          className="btn-primary mb-2"
                        >
                          Complete Payment
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrder === order.id}
                          className="px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingOrder === order.id ? 'Discarding...' : 'Discard Order'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/order-success/${order.id}`)}
                        className="btn-secondary mb-2"
                      >
                        View Details
                      </button>
                    )}
                    {order.drafts && (
                      <button
                        onClick={() => navigate(`/poster/${order.drafts.id}`)}
                        className="btn-primary"
                      >
                        View Poster
                      </button>
                    )}
                  </div>
                </div>

                {/* Poster Preview */}
                {order.drafts && order.drafts.image_url && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold mb-2">Poster Preview</h4>
                    <img
                      src={order.drafts.image_url}
                      alt="Poster preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 