const EmailService = require('./src/services/emailService');
const EmailTemplates = require('./src/templates/emailTemplates');
const EmailUtils = require('./src/utils/emailUtils');
require('dotenv').config();

async function testEmailService() {
  console.log('🧪 Testing Refactored SendGrid Email Service Integration...\n');

  // Check environment variables
  console.log('📋 Checking environment variables:');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL ? '✅ Set' : '❌ Missing');
  console.log('');

  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.error('❌ Missing required environment variables!');
    console.log('Please add the following to your .env file:');
    console.log('SENDGRID_API_KEY=your_sendgrid_api_key_here');
    console.log('SENDGRID_FROM_EMAIL=your_verified_email@domain.com');
    process.exit(1);
  }

  try {
    // Test 1: Basic email service test
    console.log('📧 Test 1: Basic email service test...');
    
    // Test SendGrid connection directly
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: process.env.SENDGRID_FROM_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Test Email - PosterAI Platform',
      text: 'This is a test email to verify SendGrid integration is working correctly.',
      html: '<p>This is a test email to verify SendGrid integration is working correctly.</p>'
    };

    const result = await sgMail.send(msg);
    
    console.log('✅ Basic email test passed!');
    console.log('Message ID:', result[0].headers['x-message-id']);

    console.log('');

    // Test 2: Email utilities test
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

    const confirmationResult = await EmailService.sendOrderConfirmation(
      mockOrderData.id,
      process.env.SENDGRID_FROM_EMAIL, // Send to self for testing
      mockOrderData
    );

    if (confirmationResult.success) {
      console.log('✅ Order confirmation email test passed!');
      console.log('Message ID:', confirmationResult.messageId);
      console.log('Order ID:', confirmationResult.orderId);
    } else {
      console.log('❌ Order confirmation email test failed:', confirmationResult.error);
    }

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
  }
}

// Run the test
testEmailService().catch(console.error);
