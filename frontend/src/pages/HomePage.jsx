import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FEATURES from '../config/features';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// Decorative blob component
function Blob({ className, color = 'terracotta' }) {
  const colors = {
    terracotta: 'from-primary-300/40 to-primary-400/30',
    sage: 'from-secondary-300/40 to-secondary-400/30',
    gold: 'from-accent-200/50 to-accent-300/40',
  };

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-radial ${colors[color]} blur-3xl ${className}`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const enableAnonymousImageGeneration = FEATURES.enableAnonymousImageGeneration;

  const features = [
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
          />
        </svg>
      ),
      title: 'AI-Powered Creation',
      description:
        'Transform your ideas into stunning poster art with our intelligent design engine.',
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
          />
        </svg>
      ),
      title: 'Curated Styles',
      description: 'Choose from carefully crafted art styles, palettes, and themes that inspire.',
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
          />
        </svg>
      ),
      title: 'Premium Prints',
      description: 'Museum-quality prints on premium materials, shipped directly to your door.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Vision',
      description: 'Select your preferred art style, color palette, and subject matter.',
      color: 'bg-primary-500',
    },
    {
      number: '02',
      title: 'Generate & Refine',
      description: 'Our AI creates unique artwork based on your choices. Regenerate until perfect.',
      color: 'bg-secondary-600',
    },
    {
      number: '03',
      title: 'Print & Display',
      description: 'Select size and finish, then receive your gallery-ready poster.',
      color: 'bg-accent-400',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Decorative blobs */}
        <Blob className="w-96 h-96 -top-20 -right-20" color="terracotta" />
        <Blob className="w-80 h-80 top-1/2 -left-40" color="sage" />
        <Blob className="w-64 h-64 bottom-20 right-1/4" color="gold" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="pill">
                <span className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse" />
                AI-Powered Art Creation
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold text-charcoal leading-tight mb-6"
            >
              Create posters that
              <br />
              <span className="gradient-text">tell your story</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl text-charcoal-light max-w-2xl mb-10 leading-relaxed"
            >
              Transform your ideas into stunning wall art. Choose your style, let our AI create, and
              receive museum-quality prints at your door.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              {user ? (
                <Button to="/questionnaire" size="xl">
                  Start Creating
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Button>
              ) : enableAnonymousImageGeneration ? (
                <>
                  <Button to="/questionnaire" size="xl">
                    Start Creating
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Button>
                  <Button to="/login" variant="outline" size="xl">
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/register" size="xl">
                    Get Started Free
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Button>
                  <Button to="/login" variant="outline" size="xl">
                    Sign In
                  </Button>
                </>
              )}
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeInUp} className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 border-2 border-cream flex items-center justify-center text-secondary-700 text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-charcoal-light text-sm">
                <span className="font-semibold text-charcoal">2,500+</span> creators already making
                art
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-charcoal mb-4">
              Why creators choose us
            </h2>
            <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
              Everything you need to bring your artistic vision to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center" padding={true}>
                  <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-charcoal mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal-light leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 overflow-hidden">
        <Blob className="w-72 h-72 top-0 right-0" color="sage" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-charcoal mb-4">
              Three simple steps
            </h2>
            <p className="text-xl text-charcoal-light">From idea to wall art in minutes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-charcoal/10 to-transparent" />
                )}

                <div className="relative text-center">
                  {/* Step number */}
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${step.color} text-white font-display font-bold text-xl flex items-center justify-center shadow-medium`}
                  >
                    {step.number}
                  </div>

                  <h3 className="text-xl font-display font-semibold text-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-charcoal-light leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-12 lg:p-16 text-center shadow-xl"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white mb-4">
                Ready to create something beautiful?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of creators who have transformed their ideas into stunning wall art.
              </p>
              <Button
                to={user || enableAnonymousImageGeneration ? '/questionnaire' : '/register'}
                variant="white"
                size="xl"
              >
                {user || enableAnonymousImageGeneration ? 'Start Creating' : 'Get Started Free'}
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
