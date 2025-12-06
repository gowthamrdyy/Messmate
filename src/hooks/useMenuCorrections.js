// Custom hook for menu corrections
import { useState, useEffect, useCallback } from 'react';
import menuCorrectionService from '../services/menuCorrectionService';
import firebaseMenuCorrectionService from '../services/firebaseMenuCorrectionService';
import useAppStore from '../store/useAppStore';

export const useMenuCorrections = (date, meal) => {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { selectedMess } = useAppStore();

  // Check if Firebase is available
  const isFirebaseEnabled = () => {
    return firebaseMenuCorrectionService.isFirebaseAvailable();
  };

  // Get the appropriate service
  const getService = () => {
    return isFirebaseEnabled() ? firebaseMenuCorrectionService : menuCorrectionService;
  };



  // Load corrections (Firebase or localStorage)
  const loadCorrections = useCallback(() => {
    if (!date || !meal) return;

    setLoading(true);
    setError(null);

    try {
      const dateStr = date instanceof Date ? date.toDateString() : date;
      const service = getService();

      // Initialize sample data for Wednesday dinner if needed
      if (meal.name?.toLowerCase() === 'dinner') {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 3) { // Wednesday
          service.initializeSampleData(dateStr, selectedMess);
        }
      }

      const unsubscribe = service.getCorrections(
        dateStr,
        selectedMess,
        meal.name,
        (corrections) => {
          setCorrections(corrections);
          setLoading(false);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.error('Error loading corrections:', err);
      setError('Failed to load corrections');
      setLoading(false);
    }
  }, [date, selectedMess, meal]);

  // Submit correction
  const submitCorrection = useCallback(async (correctionData) => {
    try {
      setSubmitting(true);
      setError(null);

      const dateStr = date instanceof Date ? date.toDateString() : date;
      const service = getService();

      const correction = await service.submitCorrection({
        ...correctionData,
        userId: 'current_user',
        reportedBy: 'You',
        meal: meal?.name,
        date: dateStr,
        mess: selectedMess
      });

      // For localStorage, reload corrections to get updated list
      if (!isFirebaseEnabled()) {
        loadCorrections();
      }
      // Firebase will automatically update via real-time listener

      return correction;
    } catch (err) {
      console.error('Error submitting correction:', err);
      setError('Failed to submit correction');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [date, selectedMess, meal, loadCorrections]);

  // Vote on correction
  const voteOnCorrection = useCallback(async (correctionId, voteType) => {
    try {
      setError(null);
      const userId = 'current_user';
      const service = getService();

      if (isFirebaseEnabled()) {
        // Firebase service
        await service.voteOnCorrection(correctionId, userId, voteType);
        // Firebase will automatically update via real-time listener
      } else {
        // localStorage service
        const dateStr = date instanceof Date ? date.toDateString() : date;
        await service.voteOnCorrection(
          correctionId,
          userId,
          voteType,
          dateStr,
          selectedMess,
          meal?.name
        );
        // Reload corrections to get updated list
        loadCorrections();
      }
    } catch (err) {
      console.error('Error voting on correction:', err);
      setError('Failed to register vote');
      throw err;
    }
  }, [date, selectedMess, meal, loadCorrections]);

  // Apply correction
  const applyCorrection = useCallback(async (correctionId) => {
    try {
      setLoading(true);
      setError(null);

      const service = getService();

      if (isFirebaseEnabled()) {
        // Firebase service
        await service.applyCorrection(correctionId, 'current_user');
        // Firebase will automatically update via real-time listener
      } else {
        // localStorage service
        const dateStr = date instanceof Date ? date.toDateString() : date;
        await service.applyCorrection(
          correctionId,
          'current_user',
          dateStr,
          selectedMess,
          meal?.name
        );
        // Reload corrections to get updated list
        loadCorrections();
      }
    } catch (err) {
      console.error('Error applying correction:', err);
      setError('Failed to apply correction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [date, selectedMess, meal, loadCorrections]);

  // Check if user has voted
  const hasUserVoted = useCallback((correction) => {
    const userId = 'current_user'; // Replace with actual user ID
    return correction.userVotes?.includes(userId) || false;
  }, []);

  // Load corrections when dependencies change
  useEffect(() => {
    const unsubscribe = loadCorrections();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [loadCorrections]);

  return {
    corrections,
    loading,
    error,
    submitting,
    submitCorrection,
    voteOnCorrection,
    applyCorrection,
    hasUserVoted,
    setError,
    isFirebaseEnabled: isFirebaseEnabled()
  };
};