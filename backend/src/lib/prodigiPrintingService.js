const axios = require('axios');

// Prodigi SKU mapping based on session testing
const PRODIGI_SKUS = {
  'A4': 'GLOBAL-CFPM-A4',
  'A3': 'GLOBAL-CFPM-A3', 
  'A2': 'GLOBAL-CFPM-A2'
};

class ProdigiPrintingServiceClient {
  constructor() {
    this.apiKey = process.env.PRODIGI_API_KEY;
    this.baseURL = process.env.PRODIGI_BASE_URL || 'https://api.sandbox.prodigi.com/v4.0';
    this.webhookSecret = process.env.PRODIGI_WEBHOOK_SECRET;
    
    if (!this.apiKey) {
      throw new Error('PRODIGI_API_KEY environment variable is required');
    }
  }

  async createPrintJob(orderData) {
    try {
      const { orderId, imageUrl, specifications, shippingAddress } = orderData;
      
      // Map our specifications to Prodigi format
      const sku = PRODIGI_SKUS[specifications.size];
      if (!sku) {
        throw new Error(`Unsupported size: ${specifications.size}`);
      }

      // Prepare Prodigi order payload
      const prodigiOrder = {
        recipient: {
          name: shippingAddress.name || 'Customer',
          address: {
            line1: shippingAddress.address || shippingAddress.line1,
            line2: shippingAddress.line2,
            townOrCity: shippingAddress.city,
            stateOrCounty: shippingAddress.state,
            postalOrZipCode: shippingAddress.postalCode,
            countryCode: shippingAddress.countryCode || 'PL'
          }
        },
        items: [{
          sku: sku,
          copies: 1,
          sizing: 'fillPrintArea',
          attributes: {
            color: 'white' // Prodigi requires this attribute
          },
          assets: [{
            printArea: 'default',
            url: imageUrl
          }]
        }],
        shippingMethod: 'Standard'
      };

      console.log('Creating Prodigi order:', { orderId, sku });
      console.log('📤 Prodigi order payload:', JSON.stringify(prodigiOrder, null, 2));

      const response = await axios.post(
        `${this.baseURL}/orders`,
        prodigiOrder,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      const prodigiOrderData = response.data.order; // Access the order object
      
      return {
        id: prodigiOrderData.id,
        jobId: prodigiOrderData.id,
        status: 'created',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
        prodigiOrderId: prodigiOrderData.id
      };
    } catch (error) {
      console.error('Prodigi createPrintJob error:', error.response?.data || error.message);
      console.error('📤 Payload that failed:', JSON.stringify(orderData, null, 2));
      console.error('🔍 Validation failures:', error.response?.data?.failures);
      throw new Error(`Failed to create Prodigi order: ${error.response?.data?.message || error.message}`);
    }
  }

  async getPrintJobStatus(jobId) {
    try {
      console.log('Getting Prodigi order status:', jobId);

      const response = await axios.get(
        `${this.baseURL}/orders/${jobId}`,
        {
          headers: {
            'X-API-Key': this.apiKey
          }
        }
      );

      const orderData = response.data.order; // Access the order object
      
      // Map Prodigi status to our status
      const statusMapping = {
        'Created': 'created',
        'InProgress': 'in_production',
        'Complete': 'printed',
        'Shipped': 'shipped',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      };

      return {
        jobId,
        status: statusMapping[orderData.status.stage] || orderData.status.stage,
        updatedAt: new Date(orderData.lastUpdated),
        trackingNumber: orderData.tracking?.number,
        estimatedDeliveryDate: orderData.estimatedDeliveryDate
      };
    } catch (error) {
      console.error('Prodigi getPrintJobStatus error:', error.response?.data || error.message);
      throw new Error(`Failed to get Prodigi order status: ${error.response?.data?.message || error.message}`);
    }
  }

  async cancelPrintJob(jobId) {
    try {
      console.log('Cancelling Prodigi order:', jobId);

      await axios.delete(
        `${this.baseURL}/orders/${jobId}`,
        {
          headers: {
            'X-API-Key': this.apiKey
          }
        }
      );

      return {
        jobId,
        status: 'cancelled',
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Prodigi cancelPrintJob error:', error.response?.data || error.message);
      throw new Error(`Failed to cancel Prodigi order: ${error.response?.data?.message || error.message}`);
    }
  }

  // Validate webhook signature
  validateWebhookSignature(_payload, _signature) {
    // TODO: Implement webhook signature validation
    // For now, we'll trust the webhook (implement proper validation in production)
    return true;
  }
}

module.exports = new ProdigiPrintingServiceClient(); 