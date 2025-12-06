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
    <div className="mt-6 space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <div className="flex items-center gap-1.5">
          {isFirebaseEnabled ? (
            <>
              <Wifi size={12} className="text-nebula-success" />
              <span>Real-time sync enabled</span>
            </>
          ) : (
            <>
              <WifiOff size={12} className="text-nebula-warning" />
              <span>Local storage mode</span>
            </>
          )}
        </div>
        <span>{corrections.length} correction{corrections.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-nebula-error/10 border border-nebula-error/20 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-nebula-error" />
            <p className="text-sm text-nebula-error">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-nebula-error hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 size={20} className="animate-spin text-nebula-primary" />
          <span className="ml-2 text-sm text-text-secondary">Loading corrections...</span>
        </div>
      )}

      {/* Pending Corrections */}
      {!loading && corrections.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Users size={16} className="text-nebula-primary" />
            Community Corrections
          </h4>

          {corrections.map((correction) => (
            <motion.div
              key={correction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border backdrop-blur-sm ${correction.status === 'approved'
                  ? 'bg-nebula-success/5 border-nebula-success/20'
                  : 'bg-surface-100/50 dark:bg-white/5 border-white/20 dark:border-white/10'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Flag size={14} className="text-nebula-warning" />
                    <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                      {correction.type} • {correction.reportedBy}
                    </span>
                  </div>

                  <div className="text-sm text-text-primary mb-2">
                    {correction.type === 'replace' && (
                      <>
                        Replace "<span className="font-medium text-text-secondary">{correction.originalItem}</span>"
                        with "<span className="font-medium text-nebula-primary">{correction.newItem}</span>"
                      </>
                    )}
                    {correction.type === 'add' && (
                      <>Add "<span className="font-medium text-nebula-success">{correction.newItem}</span>"</>
                    )}
                    {correction.type === 'remove' && (
                      <>Remove "<span className="font-medium text-nebula-error">{correction.originalItem}</span>"</>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary mb-3 italic">
                    "{correction.reason}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-200 dark:bg-white/5">
                      <Users size={12} className="text-nebula-primary" />
                      <span className="text-xs font-medium text-text-secondary">
                        {correction.votes} votes
                      </span>
                    </div>

                    {correction.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(correction.id, correction)}
                          disabled={loading || submitting}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all disabled:opacity-50 font-medium ${hasUserVoted(correction)
                              ? 'bg-nebula-primary/10 text-nebula-primary hover:bg-nebula-primary/20'
                              : 'bg-surface-200 dark:bg-white/10 text-text-secondary hover:bg-surface-300 dark:hover:bg-white/20'
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
                            className="flex items-center gap-1.5 px-3 py-1 text-xs bg-nebula-success/10 text-nebula-success hover:bg-nebula-success/20 rounded-lg transition-colors font-medium disabled:opacity-50"
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
                      <div className="flex items-center gap-1.5 text-xs text-nebula-success font-medium px-2 py-1 bg-nebula-success/10 rounded-md">
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
      <div className="p-4 bg-nebula-primary/5 border border-nebula-primary/10 rounded-xl mb-3">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-nebula-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-text-primary mb-1">
              Wednesday Dinner Menu Variation
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sometimes biryani is served instead of the regular items. Help keep the menu accurate by reporting what's actually being served today.
            </p>
          </div>
        </div>
      </div>

      {/* Report Correction Button */}
      <button
        onClick={() => setShowCorrectionForm(!showCorrectionForm)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm bg-surface-200 dark:bg-white/5 hover:bg-surface-300 dark:hover:bg-white/10 text-text-primary rounded-xl transition-all font-medium group"
      >
        <Edit3 size={16} className="text-nebula-secondary group-hover:scale-110 transition-transform" />
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
            <div className="p-5 bg-surface-100 dark:bg-nebula-dark border border-white/20 dark:border-white/10 rounded-2xl space-y-5 mt-2 shadow-lg">
              <h4 className="font-bold text-text-primary flex items-center gap-2">
                <AlertCircle size={18} className="text-nebula-secondary" />
                Report Wednesday Dinner Menu
              </h4>

              {/* Correction Type */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
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
                      className={`px-3 py-2 text-sm rounded-lg transition-all font-medium flex-1 ${correctionType === type.value
                          ? 'bg-nebula-primary text-white shadow-lg shadow-nebula-primary/20'
                          : 'bg-surface-200 dark:bg-white/5 text-text-secondary hover:bg-surface-300 dark:hover:bg-white/10'
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
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    Select item to {correctionType}:
                  </label>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-200 dark:bg-white/5 border border-transparent focus:border-nebula-primary/50 rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-nebula-primary/20 outline-none transition-all"
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
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    {correctionType === 'replace' ? 'Replace with:' : 'Add item:'}
                  </label>
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Enter the correct item name..."
                    className="w-full px-4 py-2.5 bg-surface-200 dark:bg-white/5 border border-transparent focus:border-nebula-primary/50 rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-nebula-primary/20 outline-none transition-all placeholder-text-tertiary"
                  />
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Reason for correction:
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain what's being served today..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface-200 dark:bg-white/5 border border-transparent focus:border-nebula-primary/50 rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-nebula-primary/20 outline-none transition-all placeholder-text-tertiary resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmitCorrection}
                  disabled={
                    submitting ||
                    !reason.trim() ||
                    (!selectedItem && correctionType !== 'add') ||
                    (!newItem && correctionType !== 'remove')
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-nebula-primary hover:bg-nebula-primary/90 disabled:bg-surface-300 dark:disabled:bg-white/10 disabled:text-text-tertiary text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-nebula-primary/20 disabled:shadow-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag size={16} />
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
                  className="px-6 py-2.5 bg-surface-200 hover:bg-surface-300 dark:bg-white/5 dark:hover:bg-white/10 text-text-secondary text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
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