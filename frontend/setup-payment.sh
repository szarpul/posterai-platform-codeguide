#!/bin/bash

echo "🚀 Setting up Frontend Payment Integration..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Creating .env file..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Backend API Configuration
REACT_APP_API_URL=http://localhost:4000/api
EOF
    echo "✅ Created .env file - please update with your actual values"
else
    echo "⚠️  .env file already exists - please check your configuration"
fi

echo ""
echo "🎯 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your actual values"
echo "2. Ensure backend is running on localhost:4000"
echo "3. Run 'npm start' to start the frontend"
echo "4. Test the payment flow with a draft"
echo ""
echo "📖 See PAYMENT_INTEGRATION_README.md for detailed instructions" 