const { Resend } = require('resend');
const EmailVendor = require('./EmailVendor');
const EmailTemplates = require('../../templates/emailTemplates');
const EmailUtils = require('../../utils/emailUtils');

/**
 * Resend email vendor implementation
 * Uses Resend API to send emails
 */
class ResendVendor extends EmailVendor {
  constructor() {
    super();
    this.resend = null;
    this.fromEmail = process.env.RESEND_FROM_EMAIL;
    this.initializeResend();
  }

  /**
   * Initialize the Resend client
   */
  initializeResend() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * Send order confirmation email via Resend
   * @param {string} orderId - Order identifier
   * @param {string} customerEmail - Customer email address
   * @param {Object} orderData - Order data including draft information
   * @returns {Promise<Object>} Email sending result
   */
  async sendOrderConfirmation(orderId, customerEmail, orderData = null) {
    try {
      EmailUtils.logEmailAttempt('order_confirmation', customerEmail, this.getVendorName());
      
      // Process order data for email template
      let processedData = orderData;
      if (orderData && orderData.user_id) {
        try {
          // Get user data and prepare email data
          const user = await EmailUtils.getUserById(orderData.user_id);
          processedData = EmailUtils.prepareOrderEmailData(orderData, user);
        } catch (userError) {
          console.warn('⚠️  Could not fetch user data, using fallback data:', userError.message);
          // Use fallback data if user fetch fails
          processedData = {
            orderId: orderData.id,
            customerName: orderData.shipping_address?.name || 'Customer',
            customerEmail: customerEmail,
            posterSize: orderData.size,
            posterFinish: orderData.finish,
            posterImage: orderData.drafts?.image_url,
            amount: EmailUtils.formatCurrency(orderData.amount_cents),
            currency: 'PLN',
            orderDate: EmailUtils.formatDate(orderData.created_at),
            shippingAddress: orderData.shipping_address,
            estimatedDelivery: EmailUtils.calculateEstimatedDelivery(orderData.created_at)
          };
        }
      }
      
      const html = EmailTemplates.createOrderConfirmationHTML(processedData);
      const text = EmailTemplates.createOrderConfirmationText(processedData);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: customerEmail,
        subject: `Potwierdzenie zamówienia #${orderId}`,
        html: html,
        text: text,
      });
      
      console.log('✅ Resend order confirmation sent:', result.data.id);
      return {
        success: true,
        messageId: result.data.id,
        orderId: orderId,
        customerEmail: customerEmail
      };
    } catch (error) {
      console.error('❌ Resend order confirmation failed:', error.message);
      throw error;
    }
  }

  /**
   * Send order status update email via Resend
   * @param {string} orderId - Order identifier
   * @param {string} customerEmail - Customer email address
   * @param {string} status - Order status (shipped, delivered, etc.)
   * @param {Object} additionalData - Additional data like tracking info
   * @returns {Promise<Object>} Email sending result
   */
  async sendOrderStatusUpdate(orderId, customerEmail, status, additionalData = {}) {
    try {
      EmailUtils.logEmailAttempt('order_status_update', customerEmail, this.getVendorName());
      const html = EmailTemplates.createOrderStatusUpdateHTML({
        orderId,
        status,
        customerName: additionalData.customerName || 'Klient',
        updateDate: new Date().toLocaleDateString('pl-PL'),
        trackingNumber: additionalData.trackingNumber,
        estimatedDelivery: additionalData.estimatedDelivery
      });
      const text = EmailTemplates.createOrderStatusUpdateText({
        orderId,
        status,
        customerName: additionalData.customerName || 'Klient',
        updateDate: new Date().toLocaleDateString('pl-PL'),
        trackingNumber: additionalData.trackingNumber,
        estimatedDelivery: additionalData.estimatedDelivery
      });

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: customerEmail,
        subject: `Aktualizacja statusu zamówienia #${orderId}`,
        html: html,
        text: text,
      });
      
      console.log('✅ Resend status update sent:', result.data?.id);
      return {
        success: true,
        messageId: result.data?.id,
        orderId: orderId,
        customerEmail: customerEmail,
        status: status
      };
    } catch (error) {
      console.error('❌ Resend status update failed:', error.message);
      throw error;
    }
  }

  /**
   * Send print instructions email via Resend
   * @param {string} customerEmail - Customer email address
   * @param {Object} instructionData - Instruction data
   * @returns {Promise<Object>} Email sending result
   */
  async sendPrintInstructions(customerEmail, instructionData = {}) {
    try {
      EmailUtils.logEmailAttempt('print_instructions', customerEmail, this.getVendorName());

      const html = EmailTemplates.createPrintInstructionsHTML(instructionData);
      const text = EmailTemplates.createPrintInstructionsText(instructionData);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: customerEmail,
        subject: 'Instrukcje wydruku plakatu',
        html,
        text,
      });

      console.log('✅ Resend print instructions sent:', result.data?.id);
      return {
        success: true,
        messageId: result.data?.id,
        customerEmail,
      };
    } catch (error) {
      console.error('❌ Resend print instructions failed:', error.message);
      throw error;
    }
  }

  /**
   * Test the Resend connection
   * @returns {Promise<boolean>} Connection test result
   */
  async testConnection() {
    try {
      // Send a simple test email to verify connection
      const testEmail = {
        from: this.fromEmail,
        to: process.env.RESEND_FROM_EMAIL, // Send to self for testing
        subject: 'Resend Connection Test - PosterAI Platform',
        html: '<p>This is a test email to verify Resend integration is working correctly.</p>',
        text: 'This is a test email to verify Resend integration is working correctly.'
      };

      const result = await this.resend.emails.send(testEmail);
      
      if (result.data?.id) {
        console.log('✅ Resend connection test successful');
        console.log('Test email ID:', result.data.id);
        return true;
      } else {
        console.log('❌ Resend connection test failed - no email ID returned');
        return false;
      }
    } catch (error) {
      console.error('❌ Resend connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Get the vendor name
   * @returns {string} Vendor name
   */
  getVendorName() {
    return 'Resend';
  }
}

module.exports = ResendVendor;

