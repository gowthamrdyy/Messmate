/**
 * FCM Token Demo Component
 * Shows how to get and display FCM tokens
 */

import React, { useState, useEffect } from 'react';
import FCMTokenDisplay from './ui/FCMTokenDisplay.jsx';
import FirebaseTestComponent from './ui/FirebaseTestComponent.jsx';

const FCMTokenDemo = () => {
  const [activeTab, setActiveTab] = useState('token');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔑 FCM Token Demo
          </h1>
          <p className="text-lg text-gray-600">
            Get your FCM token and test push notifications
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setActiveTab('token')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'token'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🔑 FCM Token
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'test'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🧪 Test Notifications
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'token' && (
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🎯 Quick Start Guide
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-medium">Open Browser Console</p>
                      <p className="text-sm text-gray-600">Press F12 and go to Console tab</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-medium">Run Command</p>
                      <p className="text-sm text-gray-600">Type: <code className="bg-gray-100 px-2 py-1 rounded">await getFCMToken()</code></p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-medium">Copy Token</p>
                      <p className="text-sm text-gray-600">Copy the token that appears in console</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  💻 Console Commands
                </h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-800">Get FCM Token:</p>
                    <code className="text-blue-600">await getFCMToken()</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-800">Get Current Token:</p>
                    <code className="text-blue-600">getCurrentToken()</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-800">Copy to Clipboard:</p>
                    <code className="text-blue-600">await copyFCMToken()</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-800">Show Info:</p>
                    <code className="text-blue-600">showFCMTokenInfo()</code>
                  </div>
                </div>
              </div>

              <FCMTokenDisplay />
            </div>
          )}

          {activeTab === 'test' && (
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🧪 Test Push Notifications
                </h2>
                <p className="text-gray-600 mb-4">
                  Test all notification features including meal reminders, menu updates, and special meals.
                </p>
              </div>

              <FirebaseTestComponent />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">
            <strong>🆓 FREE Service:</strong> No paid services required!
          </p>
          <p className="text-sm">
            Works with local notifications and optional web push notifications
          </p>
        </div>
      </div>
    </div>
  );
};

export default FCMTokenDemo;
