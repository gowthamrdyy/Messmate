import { useState } from 'react';
import { AlertCircle, Check, X, Users, Edit3, Flag, Loader2, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuCorrections } from '../../hooks/useMenuCorrections';

const MenuCorrection = ({ meal, date, menuItems, onMenuUpdate }) => {
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [correctionType, setCorrectionType] = useState('replace');
  const [selectedItem, setSelectedItem] = useState('');
  const [newItem, setNewItem] = useState('');
  const [reason, setReason] = useState('');

  // Use the custom hook for menu corrections
  const {
    corrections,
    loading,
    error,
    submitting,
    submitCorrection,
    voteOnCorrection,
    applyCorrection,
    hasUserVoted,
    setError,
    isFirebaseEnabled
  } = useMenuCorrections(date, meal);

  // Check if this is Wednesday dinner - only show corrections for this case
  const isWednesdayDinner = () => {
    try {
      if (!date || !meal) return false;
      const dayOfWeek = date.getDay(); // 0 = Sunday, 3 = Wednesday
      const mealName = meal.name?.toLowerCase();
      return dayOfWeek === 3 && mealName === 'dinner';
    } catch (err) {
      console.error('Error checking Wednesday dinner:', err);
      return false;
    }
  };

  // Don't render anything if it's not Wednesday dinner
  if (!isWednesdayDinner()) {
    return null;
  }

  const handleSubmitCorrection = async () => {
    try {
      // Validation
      if (!selectedItem && correctionType !== 'add') {
        setError('Please select an item to modify');
        return;
      }
      if (!newItem && correctionType !== 'remove') {
        setError('Please enter the new item name');
        return;
      }
      if (!reason.trim()) {
        setError('Please provide a reason for this correction');
        return;
      }

      const correctionData = {
        type: correctionType,
        originalItem: selectedItem,
        newItem: newItem,
        reason: reason.trim()
      };

      await submitCorrection(correctionData);
      
      // Reset form
      setSelectedItem('');
      setNewItem('');
      setReason('');
      setShowCorrectionForm(false);
      
      // Show success message
      alert('Menu correction submitted successfully! Other students can now vote on it.');
      
    } catch (err) {
      // Error is already handled by the hook
      console.error('Error submitting correction:', err);
    }
  };

  const handleVote = async (correctionId, correction) => {
    try {
      const voteType = hasUserVoted(correction) ? 'down' : 'up';
      await voteOnCorrection(correctionId, voteType);
    } catch (err) {
      // Error is already handled by the hook
      console.error('Error voting on correction:', err);
    }
  };

  const handleApplyCorrection = async (correction) => {
    try {
      if (correction.votes < 5) {
        setError('Correction needs at least 5 votes to be applied');
        return;
      }

      await applyCorrection(correction.id);

      // Apply the correction to the menu
      let updatedItems = [...menuItems];
      
      switch (correction.type) {
        case 'replace':
          updatedItems = updatedItems.map(item => 
            item === correction.originalItem ? correction.newItem : item
          );
          break;
        case 'add':
          if (!updatedItems.includes(correction.newItem)) {
            updatedItems.push(correction.newItem);
          }
          break;
        case 'remove':
          updatedItems = updatedItems.filter(item => item !== correction.originalItem);
          break;
        default:
          throw new Error('Invalid correction type');
      }
      
      // Notify parent component
      if (onMenuUpdate) {
        onMenuUpdate(updatedItems);
      }
      
      alert('Menu correction applied successfully!');
      
    } catch (err) {
      // Error is already handled by the hook
      console.error('Error applying correction:', err);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          {isFirebaseEnabled ? (
            <>
              <Wifi size={12} className="text-green-500" />
              <span>Real-time sync enabled</span>
            </>
          ) : (
            <>
              <WifiOff size={12} className="text-orange-500" />
              <span>Local storage mode</span>
            </>
          )}
        </div>
        <span>{corrections.length} correction{corrections.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 size={20} className="animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading corrections...</span>
        </div>
      )}

      {/* Pending Corrections */}
      {!loading && corrections.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            Community Corrections
          </h4>
          
          {corrections.map((correction) => (
            <motion.div
              key={correction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border ${
                correction.status === 'approved' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Flag size={14} className="text-orange-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {correction.type.toUpperCase()} • {correction.reportedBy}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-900 dark:text-white mb-1">
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
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {correction.reason}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-blue-500" />
                      <span className="text-xs font-medium text-blue-600">
                        {correction.votes} votes
                      </span>
                    </div>
                    
                    {correction.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(correction.id, correction)}
                          disabled={loading || submitting}
                          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors disabled:opacity-50 ${
                            hasUserVoted(correction)
                              ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                              : 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300'
                          }`}
                        >
                          {hasUserVoted(correction) ? (
                            <>
                              <X size={12} />
                              Remove Vote
                            </>
                          ) : (
                            <>
                              <Check size={12} />
                              Vote
                            </>
                          )}
                        </button>
                        
                        {correction.votes >= 5 && (
                          <button
                            onClick={() => handleApplyCorrection(correction)}
                            disabled={loading || submitting}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded transition-colors font-medium disabled:opacity-50"
                          >
                            {loading ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                Applying...
                              </>
                            ) : (
                              <>
                                <Check size={12} />
                                Apply Fix
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {correction.status === 'approved' && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <Check size={12} />
                        Applied
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Wednesday Dinner Specific Notice */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Wednesday Dinner Menu Variation
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Sometimes biryani is served instead of the regular items. Help keep the menu accurate by reporting what's actually being served today.
            </p>
          </div>
        </div>
      </div>

      {/* Report Correction Button */}
      <button
        onClick={() => setShowCorrectionForm(!showCorrectionForm)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg transition-colors"
      >
        <Edit3 size={14} />
        Report Today's Menu
      </button>

      {/* Correction Form */}
      <AnimatePresence>
        {showCorrectionForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-500" />
                Report Wednesday Dinner Menu
              </h4>
              
              {/* Correction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What type of correction?
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'replace', label: 'Replace Item' },
                    { value: 'add', label: 'Add Item' },
                    { value: 'remove', label: 'Remove Item' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setCorrectionType(type.value)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        correctionType === type.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Original Item Selection */}
              {(correctionType === 'replace' || correctionType === 'remove') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select item to {correctionType}:
                  </label>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose an item...</option>
                    {menuItems.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* New Item Input */}
              {(correctionType === 'replace' || correctionType === 'add') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {correctionType === 'replace' ? 'Replace with:' : 'Add item:'}
                  </label>
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Enter the correct item name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for correction:
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain what's being served today (e.g., 'Today they served biryani instead of chicken masala' or 'Regular menu items are being served as usual')"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitCorrection}
                  disabled={
                    submitting || 
                    !reason.trim() || 
                    (!selectedItem && correctionType !== 'add') || 
                    (!newItem && correctionType !== 'remove')
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag size={14} />
                      Submit Correction
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowCorrectionForm(false);
                    setError(null);
                    setSelectedItem('');
                    setNewItem('');
                    setReason('');
                  }}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuCorrection;