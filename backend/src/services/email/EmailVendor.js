/**
 * Abstract base class for email vendors
 * Defines the interface that all email vendors must implement
 * Cannot be instantiated directly - must be extended by concrete implementations
 */
class EmailVendor {
  constructor() {
    if (this.constructor === EmailVendor) {
      throw new Error('EmailVendor is abstract and cannot be instantiated');
    }
  }

  /**
   * Send order confirmation email
   * @param {string} orderId - Order identifier
   * @param {string} customerEmail - Customer email address
   * @param {Object} orderData - Order data including draft information
   * @returns {Promise<Object>} Email sending result
   */
  async sendOrderConfirmation(_orderId, _customerEmail, _orderData) {
    throw new Error('Must implement sendOrderConfirmation');
  }

  /**
   * Send order status update email
   * @param {string} orderId - Order identifier
   * @param {string} customerEmail - Customer email address
   * @param {string} status - Order status (e.g., 'shipped', 'delivered')
   * @param {Object} additionalData - Additional data for the email
   * @returns {Promise<Object>} Email sending result
   */
  async sendOrderStatusUpdate(_orderId, _customerEmail, _status, _additionalData) {
    throw new Error('Must implement sendOrderStatusUpdate');
  }

  /**
   * Test the email provider connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    throw new Error('Must implement testConnection');
  }

  /**
   * Get provider name for logging purposes
   * @returns {string} Provider name
   */
  getProviderName() {
    throw new Error('Must implement getProviderName');
  }
}

module.exports = EmailVendor;
