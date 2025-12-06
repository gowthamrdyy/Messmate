import { useState } from 'react';
import { Shield, Check, X, Eye, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MenuAdmin = ({ className = '' }) => {
  const [corrections, setCorrections] = useState([
    {
      id: 1,
      type: 'replace',
      originalItem: 'Chicken Masala/Paneer Butter Masala',
      newItem: 'Chicken Biryani',
      reason: 'Today they served biryani instead of the regular items',
      votes: 15,
      reportedBy: 'Multiple Students',
      timestamp: new Date().toISOString(),
      status: 'pending',
      meal: 'Dinner',
      date: 'Wednesday',
      mess: 'sannasi'
    },
    {
      id: 2,
      type: 'remove',
      originalItem: 'Veg Salad',
      newItem: '',
      reason: 'Salad was not served today',
      votes: 8,
      reportedBy: 'Student',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'pending',
      meal: 'Dinner',
      date: 'Tuesday',
      mess: 'mblock'
    }
  ]);

  const handleApprove = (correctionId) => {
    setCorrections(prev => 
      prev.map(correction => 
        correction.id === correctionId 
          ? { ...correction, status: 'approved' }
          : correction
      )
    );
  };

  const handleReject = (correctionId) => {
    setCorrections(prev => 
      prev.map(correction => 
        correction.id === correctionId 
          ? { ...correction, status: 'rejected' }
          : correction
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Menu Administration
        </h2>
      </div>

      <div className="space-y-4">
        {corrections.map((correction) => (
          <motion.div
            key={correction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(correction.status)}`}>
                    {correction.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {correction.type.toUpperCase()}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar size={14} />
                    <span>{correction.date} • {correction.meal} • {correction.mess.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={14} />
                    <span>{new Date(correction.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-900 dark:text-white mb-2">
                  {correction.type === 'replace' && (
                    <>
                      Replace "<span className="font-medium">{correction.originalItem}</span>" 
                      with "<span className="font-medium text-blue-600">{correction.newItem}</span>"
                    </>
                  )}
                  {correction.type === 'add' && (
                    <>Add "<span className="font-medium text-green-600">{correction.newItem}</span>"</>
                  )}
                  {correction.type === 'remove' && (
                    <>Remove "<span className="font-medium text-red-600">{correction.originalItem}</span>"</>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <strong>Reason:</strong> {correction.reason}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-blue-500" />
                    <span className="text-blue-600 font-medium">{correction.votes} student votes</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Reported by: {correction.reportedBy}
                  </span>
                </div>
              </div>

              {correction.status === 'pending' && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(correction.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Check size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(correction.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <X size={14} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {corrections.filter(c => c.status === 'pending').length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Shield size={48} className="mx-auto mb-4 opacity-50" />
          <p>No pending corrections to review</p>
        </div>
      )}
    </div>
  );
};

export default MenuAdmin;