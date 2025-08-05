// Import the real Prodigi service instead of using mock
const prodigiService = require('./prodigiPrintingService');

// Export the Prodigi service directly
module.exports = prodigiService; 