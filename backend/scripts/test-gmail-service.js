require('dotenv').config();

const EmailService = require('../src/services/emailService');
const EmailVendorProvider = require('../src/services/email/EmailVendorProvider');

async function testGmailService() {
  console.log('🧪 Testing Gmail Email Service...\n');
  
  // Check environment variables
  console.log('📋 Checking environment variables:');
  console.log('EMAIL_VENDOR:', process.env.EMAIL_VENDOR || 'gmail (default)');
  console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Missing');
  console.log('GMAIL_FROM_EMAIL:', process.env.GMAIL_FROM_EMAIL ? '✅ Set' : '❌ Missing');
  console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing');
  console.log('');

  if (!process.env.GMAIL_USER || !process.env.GMAIL_FROM_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Missing required Gmail environment variables!');
    console.log('Please add the following to your .env file:');
    console.log('EMAIL_VENDOR=gmail');
    console.log('GMAIL_USER=your-email@gmail.com');
    console.log('GMAIL_FROM_EMAIL=your-email@gmail.com');
    console.log('GMAIL_APP_PASSWORD=your-16-character-app-password');
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
    console.log('📧 Test 3: Testing Gmail connection...');
    const isConnected = await emailService.testConnection();
    if (isConnected) {
      console.log('✅ Gmail connection successful');
    } else {
      console.log('❌ Gmail connection failed');
      process.exit(1);
    }
    console.log('');

    // Test 4: Order Confirmation Email Test
    console.log('📧 Test 4: Testing order confirmation email...');
    const testOrderData = {
      id: 'TEST-ORDER-GMAIL-123',
      total_cents: 2500,
      size: 'A3',
      material: '200 gsm matte',
      finish: 'matte',
      drafts: {
        questionnaire: {
          style: 'modern',
          theme: 'nature',
          mood: 'calm',
          color_palette: 'warm',
          subject: 'landscapes'
        },
        image_url: 'https://via.placeholder.com/400x600/1E3A8A/FFFFFF?text=Gmail+Test+Poster'
      }
    };
    
    const confirmationResult = await emailService.sendOrderConfirmation(
      testOrderData.id,
      process.env.GMAIL_USER, // Send to yourself for testing
      testOrderData
    );
    
    console.log('✅ Order confirmation email sent successfully');
    console.log('📧 Email details:', {
      messageId: confirmationResult.messageId,
      orderId: confirmationResult.orderId,
      recipient: process.env.GMAIL_USER
    });
    console.log('');

    // Test 5: Order Status Update Email Test
    console.log('📧 Test 5: Testing order status update email...');
    const statusUpdateResult = await emailService.sendOrderStatusUpdate(
      testOrderData.id,
      process.env.GMAIL_USER,
      'shipped',
      {
        trackingNumber: 'GM123456789',
        estimatedDelivery: '2024-01-15'
      }
    );
    
    console.log('✅ Order status update email sent successfully');
    console.log('📧 Email details:', {
      messageId: statusUpdateResult.messageId,
      orderId: statusUpdateResult.orderId,
      status: statusUpdateResult.status,
      recipient: process.env.GMAIL_USER
    });
    console.log('');

    console.log('🎉 All Gmail email service tests passed!');
    console.log('');
    console.log('📬 Check your Gmail inbox for the test emails.');
    console.log('📧 Sent to:', process.env.GMAIL_USER);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testGmailService().catch(console.error);

