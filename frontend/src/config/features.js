const FEATURES = {
  enableStripeCheckout: process.env.REACT_APP_ENABLE_STRIPE_CHECKOUT !== 'false',
  enableAnonymousImageGeneration:
    process.env.REACT_APP_ENABLE_ANONYMOUS_IMAGE_GENERATION === 'true',
};

export default FEATURES;
