require('dotenv').config();

const EmailService = require('../src/services/emailService');
const EmailTemplates = require('../src/templates/emailTemplates');
const EmailUtils = require('../src/utils/emailUtils');

// Create email service instance
const emailService = new EmailService();

async function testEmailService() {
  console.log('🧪 Testing Email Service Integration (Gmail/SendGrid)...\n');

  // Check environment variables
  console.log('📋 Checking environment variables:');
  console.log('EMAIL_VENDOR:', process.env.EMAIL_VENDOR || 'gmail (default)');
  
  if (process.env.EMAIL_VENDOR === 'gmail' || !process.env.EMAIL_VENDOR) {
    console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('GMAIL_FROM_EMAIL:', process.env.GMAIL_FROM_EMAIL ? '✅ Set' : '❌ Missing');
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing');
  } else if (process.env.EMAIL_VENDOR === 'sendgrid') {
    console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL ? '✅ Set' : '❌ Missing');
  }
  console.log('');

  // Validate environment variables based on vendor
  const vendorType = process.env.EMAIL_VENDOR || 'gmail';
  
  if (vendorType === 'gmail') {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_FROM_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ Missing required Gmail environment variables!');
      console.log('Please add the following to your .env file:');
      console.log('EMAIL_VENDOR=gmail');
      console.log('GMAIL_USER=your-email@gmail.com');
      console.log('GMAIL_FROM_EMAIL=your-email@gmail.com');
      console.log('GMAIL_APP_PASSWORD=your-16-character-app-password');
      process.exit(1);
    }
  } else if (vendorType === 'sendgrid') {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      console.error('❌ Missing required SendGrid environment variables!');
      console.log('Please add the following to your .env file:');
      console.log('EMAIL_VENDOR=sendgrid');
      console.log('SENDGRID_API_KEY=your_sendgrid_api_key_here');
      console.log('SENDGRID_FROM_EMAIL=your_verified_email@domain.com');
      process.exit(1);
    }
  }

  try {
    // Test 1: Connection Test
    console.log('📧 Test 1: Testing email service connection...');
    const isConnected = await emailService.testConnection();
    if (isConnected) {
      console.log('✅ Email service connection successful');
    } else {
      console.log('❌ Email service connection failed');
      process.exit(1);
    }
    console.log('');
    console.log('📧 Test 2: Email utilities test...');
    
    const testDate = new Date();
    const estimatedDelivery = EmailUtils.calculateEstimatedDelivery(testDate.toISOString());
    const formattedAmount = EmailUtils.formatCurrency(2999);
    const formattedDate = EmailUtils.formatDate(testDate);
    
    console.log('✅ Email utilities test passed!');
    console.log('- Estimated delivery:', estimatedDelivery);
    console.log('- Formatted amount:', formattedAmount);
    console.log('- Formatted date:', formattedDate);

    console.log('');

    // Test 3: Email templates test
    console.log('📧 Test 3: Email templates test...');
    
    const mockEmailData = {
      orderId: 'test-order-123',
      customerName: 'Jan Kowalski',
      posterSize: 'A4',
      posterFinish: 'matte',
      amount: '29.99 PLN',
      currency: 'PLN',
      orderDate: formattedDate,
      shippingAddress: {
        name: 'Jan Kowalski',
        address: 'ul. Testowa 123',
        city: 'Warszawa',
        postalCode: '00-001',
        countryCode: 'PL'
      },
      estimatedDelivery: estimatedDelivery,
      posterImage: 'https://via.placeholder.com/400x600/1E3A8A/FFFFFF?text=Test+Poster'
    };

    const htmlTemplate = EmailTemplates.createOrderConfirmationHTML(mockEmailData);
    const textTemplate = EmailTemplates.createOrderConfirmationText(mockEmailData);
    
    console.log('✅ Email templates test passed!');
    console.log('- HTML template length:', htmlTemplate.length, 'characters');
    console.log('- Text template length:', textTemplate.length, 'characters');

    console.log('');

    // Test 4: Order confirmation email test
    console.log('📧 Test 4: Order confirmation email test...');
    
    const mockOrderData = {
      id: 'test-order-123',
      user_id: 'test-user-456',
      size: 'A4',
      finish: 'matte',
      amount_cents: 2999,
      shipping_address: {
        name: 'Jan Kowalski',
        address: 'ul. Testowa 123',
        city: 'Warszawa',
        postalCode: '00-001',
        countryCode: 'PL'
      },
      created_at: testDate.toISOString(),
      drafts: {
        id: 'test-draft-789',
        questionnaire: {
          style: 'modern',
          theme: 'nature',
          mood: 'calm',
          color: 'warm',
          subject: 'landscapes'
        },
        image_url: 'https://via.placeholder.com/400x600/1E3A8A/FFFFFF?text=Test+Poster'
      }
    };

    const confirmationResult = await emailService.sendOrderConfirmation(
      mockOrderData.id,
      vendorType === 'gmail' ? process.env.GMAIL_USER : process.env.SENDGRID_FROM_EMAIL, // Send to self for testing
      mockOrderData
    );

    console.log('✅ Order confirmation email test passed!');
    console.log('Message ID:', confirmationResult.messageId);
    console.log('Order ID:', confirmationResult.orderId);

    console.log('');
    console.log('🎉 All refactored email tests completed!');
    console.log('Check your email inbox for the test emails.');
    console.log('');
    console.log('📁 Refactored files:');
    console.log('- EmailService: backend/src/services/emailService.js');
    console.log('- EmailTemplates: backend/src/templates/emailTemplates.js');
    console.log('- EmailUtils: backend/src/utils/emailUtils.js');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Log SendGrid error details if available
    if (error.response) {
      console.error('📧 SendGrid Error Details:');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Body:', JSON.stringify(error.response.body, null, 2));
      console.error('Response Headers:', JSON.stringify(error.response.headers, null, 2));
    }
  }
}

// Run the test
testEmailService().catch(console.error);
