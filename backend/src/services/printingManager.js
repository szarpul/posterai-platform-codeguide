const printingService = require('../lib/printingService');
const supabase = require('../lib/supabase');
const OrderProcessor = require('./orderProcessor');

class PrintingManager {
  static async createPrintJob(orderId) {
    try {
      // Get order details with draft information
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          drafts (*)
        `)
        .eq('id', orderId)
        .single();

      if (error || !order) {
        throw new Error('Order not found');
      }

      console.log('📋 Order data for Prodigi:', {
        orderId: order.id,
        imageUrl: order.drafts?.image_url,
        size: order.size,
        finish: order.finish,
        shippingAddress: order.shipping_address
      });

      // Prepare print job data
      const printJobData = {
        orderId: order.id,
        imageUrl: order.drafts.image_url,
        specifications: {
          size: order.size,
          finish: order.finish
        },
        shippingAddress: order.shipping_address
      };

      console.log('📤 Sending to Prodigi:', JSON.stringify(printJobData, null, 2));

      // Create print job with external service
      const printJob = await printingService.createPrintJob(printJobData);

      // Update order with print job details
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          print_job_id: printJob.id,
          status: 'in_production',
          print_job_created_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw new Error('Failed to update order with print job details');
      }

      return printJob;
    } catch (error) {
      console.error('Create print job error:', error);
      throw error;
    }
  }

  static async updatePrintJobStatus(orderId) {
    try {
      // Get order with print job ID
      const { data: order, error } = await supabase
        .from('orders')
        .select('print_job_id')
        .eq('id', orderId)
        .single();

      if (error || !order) {
        throw new Error('Order not found');
      }

      // Get status from printing service
      const status = await printingService.getPrintJobStatus(order.print_job_id);

      // Map external status to our status
      const statusMapping = {
        'created': 'in_production',
        'printing': 'in_production',
        'printed': 'printed',
        'shipped': 'shipped',
        'delivered': 'delivered',
        'cancelled': 'cancelled'
      };

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: statusMapping[status.status] || status.status,
          tracking_number: status.tracking_number,
          estimated_delivery_date: status.estimated_delivery_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw new Error('Failed to update order status');
      }

      const newStatus = statusMapping[status.status] || status.status;

      // Send status update email to customer
      await OrderProcessor.sendOrderStatusUpdateEmail(orderId, newStatus, {
        trackingNumber: status.tracking_number,
        estimatedDelivery: status.estimated_delivery_date
      });

      return {
        orderId,
        status: newStatus,
        trackingNumber: status.tracking_number,
        estimatedDeliveryDate: status.estimated_delivery_date
      };
    } catch (error) {
      console.error('Update print job status error:', error);
      throw error;
    }
  }

  static async cancelPrintJob(orderId) {
    try {
      // Get order with print job ID
      const { data: order, error } = await supabase
        .from('orders')
        .select('print_job_id, status')
        .eq('id', orderId)
        .single();

      if (error || !order) {
        throw new Error('Order not found');
      }

      // Only allow cancellation for orders in production
      if (order.status !== 'in_production') {
        throw new Error('Order cannot be cancelled in current status');
      }

      // Cancel with printing service
      await printingService.cancelPrintJob(order.print_job_id);

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw new Error('Failed to update order status');
      }

      return { orderId, status: 'cancelled' };
    } catch (error) {
      console.error('Cancel print job error:', error);
      throw error;
    }
  }
}

module.exports = PrintingManager; 