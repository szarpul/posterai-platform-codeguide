const sgMail = require('@sendgrid/mail');
const EmailTemplates = require('../templates/emailTemplates');
const EmailUtils = require('../utils/emailUtils');

class EmailService {
  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY;
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL;
    
    if (!this.apiKey) {
      console.warn('⚠️  SENDGRID_API_KEY not found in environment variables');
    }
    
    if (!this.fromEmail) {
      console.warn('⚠️  SENDGRID_FROM_EMAIL not found in environment variables');
    }
    
    if (this.apiKey) {
      sgMail.setApiKey(this.apiKey);
    }
  }

  /**
   * Send order confirmation email
   * @param {string} orderId - Order ID
   * @param {string} customerEmail - Customer email address
   * @param {Object} orderData - Order data (optional, will fetch if not provided)
   * @returns {Promise<Object>} Email sending result
   */
  static async sendOrderConfirmation(orderId, customerEmail, orderData = null) {
    try {
      console.log('📧 Sending order confirmation email for order:', orderId);
      
      let order = orderData;
      
      // If order data not provided, fetch it from database
      if (!order) {
        order = await EmailUtils.getOrderWithDraft(orderId);
      }

      // Get user details
      const user = await EmailUtils.getUserById(order.user_id);

      // Validate email address
      if (!EmailUtils.isValidEmail(customerEmail)) {
        throw new Error('Invalid email address');
      }

      // Prepare email data
      const emailData = EmailUtils.prepareOrderEmailData(order, user);

      // Create email templates
      const htmlTemplate = EmailTemplates.createOrderConfirmationHTML(emailData);
      const textTemplate = EmailTemplates.createOrderConfirmationText(emailData);

      // Send email
      const msg = {
        to: customerEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Potwierdzenie zamówienia #${order.id}`,
        html: htmlTemplate,
        text: textTemplate
      };

      const result = await sgMail.send(msg);
      
      EmailUtils.logEmailAttempt('order_confirmation', customerEmail, orderId, true);
      
      console.log('✅ Order confirmation email sent successfully');
      
      return {
        success: true,
        messageId: result[0].headers['x-message-id'],
        orderId: orderId,
        customerEmail: customerEmail
      };

    } catch (error) {
      EmailUtils.logEmailAttempt('order_confirmation', customerEmail, orderId, false, error.message);
      console.error('❌ Failed to send order confirmation email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
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
  static async sendOrderStatusUpdate(orderId, customerEmail, status, additionalData = {}) {
    try {
      console.log('📧 Sending order status update email for order:', orderId);
      
      // Get order and user details
      const order = await EmailUtils.getOrderWithDraft(orderId);
      const user = await EmailUtils.getUserById(order.user_id);

      // Validate email address
      if (!EmailUtils.isValidEmail(customerEmail)) {
        throw new Error('Invalid email address');
      }

      // Prepare email data
      const emailData = EmailUtils.prepareStatusUpdateEmailData(order, user, status, additionalData);

      // Create email template
      const htmlTemplate = EmailTemplates.createOrderStatusUpdateHTML(emailData);

      // Send email
      const msg = {
        to: customerEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Aktualizacja statusu zamówienia #${order.id}`,
        html: htmlTemplate,
        text: `Status zamówienia #${order.id} został zaktualizowany na: ${EmailTemplates.getStatusText(status)}`
      };

      const result = await sgMail.send(msg);
      
      EmailUtils.logEmailAttempt('status_update', customerEmail, orderId, true);
      
      console.log('✅ Order status update email sent successfully');
      
      return {
        success: true,
        messageId: result[0].headers['x-message-id'],
        orderId: orderId,
        customerEmail: customerEmail,
        status: status
      };

    } catch (error) {
      EmailUtils.logEmailAttempt('status_update', customerEmail, orderId, false, error.message);
      console.error('❌ Failed to send order status update email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}

module.exports = EmailService;