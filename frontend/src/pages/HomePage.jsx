import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: '🎨',
      title: 'AI-Powered Design',
      description: 'Create stunning posters with our advanced AI technology'
    },
    {
      icon: '⚡',
      title: 'Quick & Easy',
      description: 'Generate beautiful designs in minutes, not hours'
    },
    {
      icon: '🚀',
      title: 'Print & Ship',
      description: 'High-quality prints delivered to your door'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Style',
      description: 'Select from curated options for style, theme, mood, and color palette',
      color: 'bg-primary-500'
    },
    {
      number: '02',
      title: 'Generate & Preview',
      description: 'Our AI creates your unique poster based on your choices',
      color: 'bg-secondary-500'
    },
    {
      number: '03',
      title: 'Order & Receive',
      description: 'Choose size and finish, place your order, and get your printed poster',
      color: 'bg-accent-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Create Stunning
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Posters with AI
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8"
            >
              Design beautiful posters in minutes using our AI-powered platform. 
              Choose your style, theme, and mood - we'll handle the rest.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {user ? (
                <Button
                  to="/questionnaire"
                  size="xl"
                  className="text-lg px-8 py-4"
                >
                  Start Creating
                </Button>
              ) : (
                <>
                  <Button
                    to="/register"
                    size="xl"
                    className="text-lg px-8 py-4"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    to="/login"
                    variant="outline"
                    size="xl"
                    className="text-lg px-8 py-4"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PosterAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The easiest way to create professional posters without design experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to your perfect poster
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="p-8 text-center relative">
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full ${step.color} text-white font-bold text-sm flex items-center justify-center`}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Create Your First Poster?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who have already created stunning posters
            </p>
            <Button
              to={user ? "/questionnaire" : "/register"}
              variant="accent"
              size="xl"
              className="text-lg px-8 py-4"
            >
              {user ? "Start Creating" : "Get Started Free"}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 