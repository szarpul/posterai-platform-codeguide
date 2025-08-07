import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import paymentService from '../services/paymentService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SIZES = [
  { value: 'A4', label: 'A4 (210 × 297 mm)', price: 2999 },
  { value: 'A3', label: 'A3 (297 × 420 mm)', price: 3999 },
  { value: 'A2', label: 'A2 (420 × 594 mm)', price: 4999 }
];

const FINISHES = [
  { value: 'matte', label: 'Matte', description: 'Non-reflective, elegant finish' },
  { value: 'glossy', label: 'Glossy', description: 'Vibrant, reflective finish' }
];

const PosterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedSize, setSelectedSize] = useState('A4');
  const [selectedFinish, setSelectedFinish] = useState('matte');
  const [orderLoading, setOrderLoading] = useState(false);
  
  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    line1: '',
    city: '',
    postalCode: '',
    country: 'PL'
  });

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const { data, error } = await supabase
          .from('drafts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Draft not found');
        
        // Check if the draft belongs to the current user
        if (data.user_id !== user?.id) {
          throw new Error('Unauthorized');
        }

        setDraft(data);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDraft();
    } else {
      navigate('/login');
    }
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this draft?')) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/drafts');
    } catch (err) {
      setError('Failed to delete draft');
      console.error('Error:', err);
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/questionnaire`, { state: { draft } });
  };

  const handleShippingAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateShippingAddress = () => {
    const { name, line1, city, postalCode } = shippingAddress;
    if (!name.trim() || !line1.trim() || !city.trim() || !postalCode.trim()) {
      setError('Please fill in all shipping address fields');
      return false;
    }
    return true;
  };

  async function handleOrder() {
    try {
      setOrderLoading(true);
      setError('');

      console.log('👤 User state:', user);
      console.log('👤 User ID:', user?.id);

      // Validate shipping address
      if (!validateShippingAddress()) {
        setOrderLoading(false);
        return;
      }

      // Create order using payment service
      const orderData = {
        draftId: draft.id,
        size: selectedSize,
        finish: selectedFinish,
        shippingAddress: shippingAddress
      };

      console.log('📦 Order data:', orderData);
      const order = await paymentService.createOrder(orderData);
      console.log('✅ Order created:', order);

      // Navigate to checkout
      navigate(`/checkout/${order.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading poster details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-error-600">{error}</div>
      </div>
    );
  }

  const selectedSizeOption = SIZES.find(size => size.value === selectedSize);
  const basePrice = selectedSizeOption.price;
  const finishSurcharge = selectedFinish === 'glossy' ? 500 : 0; // $5.00 surcharge for glossy
  const totalPrice = basePrice + finishSurcharge;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Poster Details</h1>
          <Button
            onClick={() => navigate('/drafts')}
            variant="outline"
          >
            Back to Drafts
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden">
              {draft.image_url && (
                <img
                  src={draft.image_url}
                  alt="Poster preview"
                  className="w-full h-auto"
                />
              )}
            </Card>
          </motion.div>

          {/* Details and Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Selected Options</h2>
              <div className="space-y-3">
                {draft.responses && Object.entries(draft.responses).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Options</h2>
              <div className="space-y-4">
                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {SIZES.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label} - ${(size.price / 100).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Finish Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Finish
                  </label>
                  <select
                    value={selectedFinish}
                    onChange={(e) => setSelectedFinish(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {FINISHES.map((finish) => (
                      <option key={finish.value} value={finish.value}>
                        {finish.label} {finish.value === 'glossy' ? '(+$5.00)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Price */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Price:</span>
                    <span className="text-xl font-bold text-primary-600">${(totalPrice / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => handleShippingAddressChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.line1}
                    onChange={(e) => handleShippingAddressChange('line1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleShippingAddressChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Postal code"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleShippingAddressChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="PL">Poland</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Actions</h2>
              <div className="space-y-3">
                <Button
                  onClick={handleOrder}
                  loading={orderLoading}
                  fullWidth
                  size="lg"
                >
                  {orderLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  fullWidth
                  size="lg"
                >
                  Edit Design
                </Button>
                <Button
                  onClick={handleDelete}
                  loading={deleting}
                  variant="danger"
                  fullWidth
                  size="lg"
                >
                  {deleting ? 'Deleting...' : 'Delete Draft'}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Draft Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="text-gray-600">
                    {new Date(draft.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Draft ID:</span>
                  <span className="text-gray-600">{draft.id}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PosterDetailPage; 