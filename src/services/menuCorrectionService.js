// Menu Correction Service - Local Storage Implementation
// This service handles all menu correction operations with localStorage
// Can be easily extended to use Firebase when needed

class MenuCorrectionService {
  constructor() {
    this.correctionsCollection = 'menuCorrections';
  }

  // Generate correction ID based on date, mess, and meal
  generateCorrectionKey(date, mess, meal) {
    const dateStr = date instanceof Date ? date.toDateString() : date;
    return `${dateStr}_${mess}_${meal}`.toLowerCase().replace(/\s+/g, '_');
  }

  // Get storage key for corrections
  getStorageKey(date, mess, meal) {
    const dateStr = date instanceof Date ? date.toDateString() : date;
    return `corrections_${mess}_${dateStr}_${meal}`;
  }

  // Submit a new menu correction
  async submitCorrection(correctionData) {
    try {
      const correction = {
        ...correctionData,
        id: `correction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        votes: 1,
        userVotes: [correctionData.userId || 'current_user'],
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Get existing corrections
      const storageKey = this.getStorageKey(correctionData.date, correctionData.mess, correctionData.meal);
      const existing = this.getCorrectionsFromStorage(storageKey);
      
      // Add new correction
      const updated = [correction, ...existing];
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(updated));
      
      return correction;
    } catch (error) {
      console.error('Error submitting correction:', error);
      throw new Error('Failed to submit correction');
    }
  }

  // Vote on a correction
  async voteOnCorrection(correctionId, userId, voteType = 'up', date, mess, meal) {
    try {
      const storageKey = this.getStorageKey(date, mess, meal);
      const corrections = this.getCorrectionsFromStorage(storageKey);
      
      const updated = corrections.map(correction => {
        if (correction.id === correctionId) {
          const userVotes = new Set(correction.userVotes || []);
          
          if (voteType === 'up' && !userVotes.has(userId)) {
            userVotes.add(userId);
            return {
              ...correction,
              userVotes: Array.from(userVotes),
              votes: correction.votes + 1,
              updatedAt: new Date().toISOString()
            };
          } else if (voteType === 'down' && userVotes.has(userId)) {
            userVotes.delete(userId);
            return {
              ...correction,
              userVotes: Array.from(userVotes),
              votes: Math.max(0, correction.votes - 1),
              updatedAt: new Date().toISOString()
            };
          }
        }
        return correction;
      });
      
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated.find(c => c.id === correctionId);
    } catch (error) {
      console.error('Error voting on correction:', error);
      throw new Error('Failed to register vote');
    }
  }

  // Apply a correction (mark as approved)
  async applyCorrection(correctionId, appliedBy, date, mess, meal) {
    try {
      const storageKey = this.getStorageKey(date, mess, meal);
      const corrections = this.getCorrectionsFromStorage(storageKey);
      
      const updated = corrections.map(correction => {
        if (correction.id === correctionId) {
          return {
            ...correction,
            status: 'approved',
            appliedBy,
            appliedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        return correction;
      });
      
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated.find(c => c.id === correctionId);
    } catch (error) {
      console.error('Error applying correction:', error);
      throw new Error('Failed to apply correction');
    }
  }

  // Get corrections from localStorage
  getCorrectionsFromStorage(storageKey) {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading corrections from storage:', error);
      return [];
    }
  }

  // Get corrections for a specific date, mess, and meal
  getCorrections(date, mess, meal, callback) {
    try {
      const storageKey = this.getStorageKey(date, mess, meal);
      const corrections = this.getCorrectionsFromStorage(storageKey);
      
      // Convert date strings back to Date objects for consistency
      const processedCorrections = corrections.map(correction => ({
        ...correction,
        createdAt: new Date(correction.createdAt),
        updatedAt: new Date(correction.updatedAt),
        appliedAt: correction.appliedAt ? new Date(correction.appliedAt) : null
      }));
      
      // Call callback immediately with current data
      callback(processedCorrections);
      
      // Return a dummy unsubscribe function for consistency with Firebase
      return () => {};
    } catch (error) {
      console.error('Error getting corrections:', error);
      callback([]);
      return () => {};
    }
  }

  // Get corrections for Wednesday dinner specifically
  getWednesdayDinnerCorrections(date, mess, callback) {
    return this.getCorrections(date, mess, 'dinner', callback);
  }

  // Check if user has already voted on a correction
  hasUserVoted(correction, userId) {
    return correction.userVotes?.includes(userId) || false;
  }

  // Get correction statistics
  getCorrectionStats(correction) {
    return {
      totalVotes: correction.votes || 0,
      canApply: (correction.votes || 0) >= 5 && correction.status === 'pending',
      isApproved: correction.status === 'approved',
      isPending: correction.status === 'pending'
    };
  }

  // Initialize sample data for Wednesday dinner if none exists
  initializeSampleData(date, mess) {
    const storageKey = this.getStorageKey(date, mess, 'dinner');
    const existing = this.getCorrectionsFromStorage(storageKey);
    
    if (existing.length === 0) {
      const sampleCorrections = [
        {
          id: `sample_${Date.now()}`,
          type: 'replace',
          originalItem: 'Chicken Masala/Paneer Butter Masala',
          newItem: 'Chicken Biryani',
          reason: 'Today they served biryani instead of the regular chicken masala - this happens on alternate Wednesdays',
          votes: 8,
          userVotes: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
          reportedBy: 'Community',
          status: 'pending',
          meal: 'dinner',
          date: date instanceof Date ? date.toDateString() : date,
          mess: mess,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem(storageKey, JSON.stringify(sampleCorrections));
      return sampleCorrections;
    }
    
    return existing;
  }
}

// Export singleton instance
export const menuCorrectionService = new MenuCorrectionService();
export default menuCorrectionService;