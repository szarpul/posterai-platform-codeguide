class MockPrintingServiceClient {
  async createPrintJob(orderData) {
    console.log('Mock: Creating print job', orderData);
    return {
      jobId: 'mock-' + Date.now(),
      status: 'created',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
  }

  async getPrintJobStatus(jobId) {
    console.log('Mock: Getting print job status', jobId);
    return {
      jobId,
      status: 'in_production',
      updatedAt: new Date()
    };
  }

  async cancelPrintJob(jobId) {
    console.log('Mock: Cancelling print job', jobId);
    return {
      jobId,
      status: 'cancelled',
      updatedAt: new Date()
    };
  }
}

module.exports = new MockPrintingServiceClient(); 