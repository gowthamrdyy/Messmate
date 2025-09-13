#!/bin/bash

echo "🚀 Messmate Notification Setup"
echo "=============================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file with your VAPID keys..."
    cat > .env << EOF
# Messmate Notification Configuration
# Your actual VAPID keys and API settings

# VAPID Keys (Your actual keys)
VITE_VAPID_PUBLIC_KEY=BGCwOJJHZWSx2lwHT44ncQUiZk7skhRU7wo-8WYL3W2OEKQC2i8FQ0-iU2nWM8GiZm3siDwb5o6UfxpbF0e_3eQ
VITE_VAPID_PRIVATE_KEY=dBUVN7nVZHPs5ryUZvRa1vn3rSdeGSWDhyD8OH2UeqE

# VAPID Subject (update with your email)
VITE_VAPID_SUBJECT=mailto:your-email@example.com

# VAPID Audience (update with your Vercel domain after deployment)
VITE_VAPID_AUDIENCE=https://your-app-name.vercel.app

# API Base URL (update with your backend server URL after deployment)
VITE_API_BASE_URL=https://your-backend-server.railway.app

# Production Settings
VITE_USE_MOCK_API=false
VITE_SKIP_VAPID=false

# Notification Settings
VITE_DEFAULT_MEAL_REMINDERS=true
VITE_DEFAULT_MENU_UPDATES=true
VITE_DEFAULT_SPECIAL_MEALS=true
VITE_DEFAULT_TEST_NOTIFICATIONS=false
EOF
    echo "✅ .env file created!"
else
    echo "⚠️  .env file already exists. Please update it manually with your VAPID keys."
fi

echo ""
echo "📋 Next Steps:"
echo "1. Update VITE_VAPID_SUBJECT with your email"
echo "2. Deploy backend server to Railway/Render"
echo "3. Update VITE_API_BASE_URL with your backend URL"
echo "4. Deploy frontend to Vercel"
echo "5. Test background notifications!"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🔑 Your VAPID Keys:"
echo "Public:  BGCwOJJHZWSx2lwHT44ncQUiZk7skhRU7wo-8WYL3W2OEKQC2i8FQ0-iU2nWM8GiZm3siDwb5o6UfxpbF0e_3eQ"
echo "Private: dBUVN7nVZHPs5ryUZvRa1vn3rSdeGSWDhyD8OH2UeqE"
echo ""
echo "🎉 Setup complete! Follow the deployment guide to get background notifications working!"

