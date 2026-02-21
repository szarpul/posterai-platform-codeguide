const EmailVendorProvider = require('./email/EmailVendorProvider');

class EmailService {
  constructor(vendor = null) {
    this.vendor = vendor || EmailVendorProvider.getDefaultVendor();
  }

  /**
   * Send order confirmation email
   * @param {string} orderId - Order ID
   * @param {string} customerEmail - Customer email address
   * @param {Object} orderData - Order data (optional, will fetch if not provided)
   * @returns {Promise<Object>} Email sending result
   */
  async sendOrderConfirmation(orderId, customerEmail, orderData = null) {
    try {
      return await this.vendor.sendOrderConfirmation(orderId, customerEmail, orderData);
    } catch (error) {
      console.error('EmailService.sendOrderConfirmation failed:', error.message);
      throw error;
    }
  }

  /**
   * Send order status update email
   * @param {string} orderId - Order ID
   * @param {string} customerEmail - Customer email address
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data (tracking number, etc.)
   * @returns {Promise<Object>} Email sending result
   */
  async sendOrderStatusUpdate(orderId, customerEmail, status, additionalData = {}) {
    try {
      return await this.vendor.sendOrderStatusUpdate(orderId, customerEmail, status, additionalData);
    } catch (error) {
      console.error('EmailService.sendOrderStatusUpdate failed:', error.message);
      throw error;
    }
  }

  /**
   * Send print instructions email
   * @param {string} customerEmail - Customer email address
   * @param {Object} instructionData - Instruction data
   * @returns {Promise<Object>} Email sending result
   */
  async sendPrintInstructions(customerEmail, instructionData) {
    try {
      return await this.vendor.sendPrintInstructions(customerEmail, instructionData);
    } catch (error) {
      console.error('EmailService.sendPrintInstructions failed:', error.message);
      throw error;
    }
  }

  /**
   * Test email service connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      return await this.vendor.testConnection();
    } catch (error) {
      console.error('EmailService.testConnection failed:', error.message);
      throw error;
    }
  }
}

module.exports = EmailService;