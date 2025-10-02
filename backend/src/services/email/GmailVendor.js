const nodemailer = require('nodemailer');
const EmailVendor = require('./EmailVendor');
const EmailTemplates = require('../../templates/emailTemplates');
const EmailUtils = require('../../utils/emailUtils');

/**
 * Gmail email vendor implementation
 * Uses Nodemailer with Gmail SMTP to send emails
 */
class GmailVendor extends EmailVendor {
  constructor() {
    super();
    this.transporter = null;
    this.fromEmail = process.env.GMAIL_FROM_EMAIL;
    this.initializeTransporter();
  }

  /**
   * Initialize the Nodemailer transporter with Gmail SMTP
   */
  initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD // App-specific password
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates for Gmail
      }
    });
  }

  /**
   * Send order confirmation email via Gmail
   * @param {string} orderId - Order identifier
   * @param {string} customerEmail - Customer email address
   * @param {Object} orderData - Order data including draft information
   * @returns {Promise<Object>} Email sending result
   */
  async sendOrderConfirmation(orderId, customerEmail, orderData) {
    try {
      EmailUtils.logEmailAttempt('order_confirmation', customerEmail, 'Gmail');
      
      const html = EmailTemplates.createOrderConfirmationHTML(orderData);
      const text = EmailTemplates.createOrderConfirmationText(orderData);
      
      const mailOptions = {
        from: this.fromEmail,
        to: customerEmail,
        subject: `Order Confirmation - ${orderId}`,
        html: html,
        text: text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Gmail order confirmation sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Gmail order confirmation failed:', error.message);
      throw error;
    }
  }

  /**
   * Send order status update email via Gmail
   * @param {string} orderId - Order identifier
   * @param {string} customerEmail - Customer email address
   * @param {string} status - Order status (e.g., 'shipped', 'delivered')
   * @param {Object} additionalData - Additional data for the email
   * @returns {Promise<Object>} Email sending result
   */
  async sendOrderStatusUpdate(orderId, customerEmail, status, additionalData) {
    try {
      EmailUtils.logEmailAttempt('order_status_update', customerEmail, 'Gmail');
      
      const html = EmailTemplates.createOrderStatusUpdateHTML(orderId, status, additionalData);
      const text = EmailTemplates.createOrderStatusUpdateText(orderId, status, additionalData);
      
      const mailOptions = {
        from: this.fromEmail,
        to: customerEmail,
        subject: `Order Update - ${orderId}`,
        html: html,
        text: text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Gmail status update sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Gmail status update failed:', error.message);
      throw error;
    }
  }

  /**
   * Test Gmail connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Gmail connection verified');
      return true;
    } catch (error) {
      console.error('❌ Gmail connection failed:', error.message);
      return false;
    }
  }

  /**
   * Get vendor name for logging purposes
   * @returns {string} Vendor name
   */
  getVendorName() {
    return 'Gmail';
  }
}

module.exports = GmailVendor;
