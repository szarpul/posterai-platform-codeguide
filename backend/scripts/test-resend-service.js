require('dotenv').config();

const EmailService = require('../src/services/emailService');
const EmailVendorProvider = require('../src/services/email/EmailVendorProvider');

async function testResendService() {
  console.log('🧪 Testing Resend Email Service...\n');
  
  // Check environment variables
  console.log('📋 Checking environment variables:');
  console.log('EMAIL_VENDOR:', process.env.EMAIL_VENDOR || 'resend (default)');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL ? '✅ Set' : '❌ Missing');
  console.log('');

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.error('❌ Missing required Resend environment variables!');
    console.log('Please add the following to your .env file:');
    console.log('EMAIL_VENDOR=resend');
    console.log('RESEND_API_KEY=your_resend_api_key_here');
    console.log('RESEND_FROM_EMAIL=your-verified-email@domain.com');
    process.exit(1);
  }

  try {
    // Test 1: Vendor Provider Test
    console.log('📧 Test 1: Testing EmailVendorProvider...');
    const vendor = EmailVendorProvider.getDefaultVendor();
    console.log('✅ Vendor created:', vendor.getVendorName());
    console.log('');

    // Test 2: Email Service Instance Test
    console.log('📧 Test 2: Testing EmailService instance...');
    const emailService = new EmailService();
    console.log('✅ EmailService instance created');
    console.log('');

    // Test 3: Connection Test
    console.log('📧 Test 3: Testing Resend connection...');
    const isConnected = await emailService.testConnection();
    if (isConnected) {
      console.log('✅ Resend connection successful');
    } else {
      console.log('❌ Resend connection failed');
      process.exit(1);
    }
    console.log('');

    // Test 4: Order Confirmation Email Test
    console.log('📧 Test 4: Testing order confirmation email...');
    const testOrderData = {
      orderId: 'TEST-ORDER-RESEND-123',
      customerName: 'Test Customer',
      orderDate: new Date().toLocaleDateString('pl-PL'),
      posterSize: 'A3',
      posterFinish: 'Matte',
      amount: '25.00',
      currency: 'PLN',
      estimatedDelivery: '3-5 dni roboczych',
      posterImage: 'https://via.placeholder.com/400x600/1E3A8A/FFFFFF?text=Resend+Test+Poster',
      shippingAddress: {
        name: 'Test Customer',
        line1: 'ul. Testowa 123',
        line2: 'Mieszkanie 45',
        postalCode: '00-001',
        city: 'Warszawa',
        countryCode: 'PL'
      },
      drafts: {
        questionnaire: {
          style: 'modern',
          theme: 'nature',
          mood: 'calm',
          color_palette: 'warm',
          subject: 'landscapes'
        },
        image_url: 'https://via.placeholder.com/400x600/1E3A8A/FFFFFF?text=Resend+Test+Poster'
      }
    };
    
    const confirmationResult = await emailService.sendOrderConfirmation(
      testOrderData.orderId,
      'szarpul@gmail.com', // Send to your personal email for testing
      testOrderData
    );
    
    console.log('✅ Order confirmation email sent successfully');
    console.log('📧 Email details:', {
      messageId: confirmationResult.messageId,
      orderId: confirmationResult.orderId,
      recipient: 'szarpul@gmail.com'
    });
    console.log('');

    // Test 5: Order Status Update Email Test
    console.log('📧 Test 5: Testing order status update email...');
    const statusUpdateResult = await emailService.sendOrderStatusUpdate(
      testOrderData.orderId,
      'szarpul@gmail.com',
      'shipped',
      {
        customerName: 'Test Customer',
        trackingNumber: 'RS123456789',
        estimatedDelivery: '2024-01-15'
      }
    );
    
    console.log('✅ Order status update email sent successfully');
    console.log('📧 Email details:', {
      messageId: statusUpdateResult.messageId,
      orderId: statusUpdateResult.orderId,
      status: statusUpdateResult.status,
      recipient: 'szarpul@gmail.com'
    });
    console.log('');

    console.log('🎉 All Resend email service tests passed!');
    console.log('');
    console.log('📬 Check your email inbox for the test emails.');
    console.log('📧 Sent to:', process.env.RESEND_FROM_EMAIL);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testResendService().catch(console.error);

