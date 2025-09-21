const supabase = require('../lib/supabase');

/**
 * Email Utilities and Helpers
 * Contains utility functions for email processing
 */
class EmailUtils {
  /**
   * Calculate estimated delivery date
   * @param {string} orderDate - Order creation date
   * @returns {string} Estimated delivery date
   */
  static calculateEstimatedDelivery(orderDate) {
    const order = new Date(orderDate);
    const delivery = new Date(order);
    delivery.setDate(delivery.getDate() + 7); // 7 days from order
    return delivery.toLocaleDateString('pl-PL');
  }

  /**
   * Format currency amount
   * @param {number} amountCents - Amount in cents
   * @param {string} currency - Currency code
   * @returns {string} Formatted amount
   */
  static formatCurrency(amountCents, currency = 'PLN') {
    const amount = amountCents / 100;
    return `${amount.toFixed(2)} ${currency}`;
  }

  /**
   * Format date for Polish locale
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  static formatDate(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pl-PL');
  }

  /**
   * Extract customer name from user data
   * @param {Object} user - User object from Supabase
   * @returns {string} Customer name
   */
  static extractCustomerName(user) {
    if (!user || !user.user) return 'Customer';
    
    // Try different name sources
    const name = user.user.user_metadata?.name || 
                 user.user.user_metadata?.full_name ||
                 user.user.email?.split('@')[0] || 
                 'Customer';
    
    return name;
  }

  /**
   * Prepare order data for email template
   * @param {Object} order - Order object
   * @param {Object} user - User object
   * @returns {Object} Formatted email data
   */
  static prepareOrderEmailData(order, user) {
    return {
      orderId: order.id,
      customerName: this.extractCustomerName(user),
      customerEmail: user.user.email,
      posterSize: order.size,
      posterFinish: order.finish,
      posterImage: order.drafts?.image_url,
      amount: this.formatCurrency(order.amount_cents),
      currency: 'PLN',
      orderDate: this.formatDate(order.created_at),
      shippingAddress: order.shipping_address,
      estimatedDelivery: this.calculateEstimatedDelivery(order.created_at)
    };
  }

  /**
   * Prepare status update email data
   * @param {Object} order - Order object
   * @param {Object} user - User object
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data (tracking number, etc.)
   * @returns {Object} Formatted email data
   */
  static prepareStatusUpdateEmailData(order, user, status, additionalData = {}) {
    return {
      orderId: order.id,
      customerName: this.extractCustomerName(user),
      customerEmail: user.user.email,
      status: status,
      updateDate: this.formatDate(new Date()),
      trackingNumber: additionalData.trackingNumber,
      estimatedDelivery: additionalData.estimatedDelivery ? 
        this.formatDate(additionalData.estimatedDelivery) : null
    };
  }

  /**
   * Validate email address format
   * @param {string} email - Email address
   * @returns {boolean} Is valid email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize email content to prevent XSS
   * @param {string} content - Content to sanitize
   * @returns {string} Sanitized content
   */
  static sanitizeEmailContent(content) {
    if (typeof content !== 'string') return '';
    
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /**
   * Get user by ID from Supabase
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  static async getUserById(userId) {
    try {
      const { data: user, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error) {
        throw new Error(`Failed to get user: ${error.message}`);
      }
      
      if (!user || !user.user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  /**
   * Get order with draft information
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order data with draft
   */
  static async getOrderWithDraft(orderId) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          drafts (
            id,
            questionnaire,
            image_url
          )
        `)
        .eq('id', orderId)
        .single();

      if (error || !order) {
        throw new Error(`Order not found: ${orderId}`);
      }

      return order;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  /**
   * Log email sending attempt
   * @param {string} type - Email type
   * @param {string} recipient - Recipient email
   * @param {string} orderId - Order ID (if applicable)
   * @param {boolean} success - Whether sending was successful
   * @param {string} error - Error message (if failed)
   */
  static logEmailAttempt(type, recipient, orderId = null, success = true, error = null) {
    const logData = {
      timestamp: new Date().toISOString(),
      type,
      recipient,
      orderId,
      success,
      error
    };

    if (success) {
      console.log(`✅ Email sent successfully:`, logData);
    } else {
      console.error(`❌ Email sending failed:`, logData);
    }
  }
}

module.exports = EmailUtils;
