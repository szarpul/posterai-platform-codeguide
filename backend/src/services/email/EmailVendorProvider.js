const GmailVendor = require('./GmailVendor');
const ResendVendor = require('./ResendVendor');
// const SendGridVendor = require('./SendGridVendor'); // We'll create this later

/**
 * Factory class for creating email vendors
 * Uses factory pattern to instantiate the correct vendor based on configuration
 */
class EmailVendorProvider {
  /**
   * Create an email vendor instance based on the specified type
   * @param {string} vendorType - Type of vendor ('gmail', 'sendgrid', etc.)
   * @returns {EmailVendor} Instance of the specified email vendor
   * @throws {Error} If vendor type is not supported
   */
  static createVendor(vendorType = 'resend') {
    switch (vendorType.toLowerCase()) {
      case 'gmail':
        return new GmailVendor();
      case 'resend':
        return new ResendVendor();
      case 'sendgrid':
        // return new SendGridVendor(); // TODO: Implement SendGrid vendor
        throw new Error('SendGrid vendor not yet implemented');
      default:
        throw new Error(`Unsupported email vendor: ${vendorType}`);
    }
  }

  /**
   * Get the default email vendor based on environment configuration
   * @returns {EmailVendor} Instance of the default email vendor
   */
  static getDefaultVendor() {
    const vendorType = process.env.EMAIL_VENDOR || 'resend';
    console.log(`📧 Using email vendor: ${vendorType}`);
    return this.createVendor(vendorType);
  }

  /**
   * Get list of available email vendors
   * @returns {string[]} Array of supported vendor names
   */
  static getAvailableVendors() {
    return ['gmail', 'resend', 'sendgrid'];
  }

  /**
   * Check if a vendor type is supported
   * @param {string} vendorType - Vendor type to check
   * @returns {boolean} True if vendor is supported
   */
  static isVendorSupported(vendorType) {
    return this.getAvailableVendors().includes(vendorType.toLowerCase());
  }
}

module.exports = EmailVendorProvider;
