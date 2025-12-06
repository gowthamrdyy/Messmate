// Firebase Menu Correction Service
// This service handles all menu correction operations with Firebase Firestore

import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';

class FirebaseMenuCorrectionService {
  constructor() {
    this.correctionsCollection = 'menuCorrections';
  }

  // Check if Firebase is available
  isFirebaseAvailable() {
    try {
      return !!db && !!import.meta.env.VITE_FIREBASE_PROJECT_ID;
    } catch {
      return false;
    }
  }

  // Generate correction document ID
  generateCorrectionKey(date, mess, meal) {
    const dateStr = date instanceof Date ? date.toDateString() : date;
    return `${dateStr}_${mess}_${meal}`.toLowerCase().replace(/\s+/g, '_');
  }

  // Submit a new menu correction
  async submitCorrection(correctionData) {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      const correction = {
        ...correctionData,
        votes: 1,
        userVotes: [correctionData.userId || 'anonymous'],
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.correctionsCollection), correction);
      console.log('✅ Correction submitted to Firebase:', docRef.id);
      
      return { id: docRef.id, ...correction };
    } catch (error) {
      console.error('❌ Error submitting correction to Firebase:', error);
      throw new Error('Failed to submit correction');
    }
  }

  // Vote on a correction
  async voteOnCorrection(correctionId, userId, voteType = 'up') {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      const correctionRef = doc(db, this.correctionsCollection, correctionId);
      
      if (voteType === 'up') {
        await updateDoc(correctionRef, {
          userVotes: arrayUnion(userId),
          votes: increment(1),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(correctionRef, {
          userVotes: arrayRemove(userId),
          votes: increment(-1),
          updatedAt: serverTimestamp()
        });
      }
      
      console.log(`✅ Vote ${voteType} registered for correction:`, correctionId);
    } catch (error) {
      console.error('❌ Error voting on correction:', error);
      throw new Error('Failed to register vote');
    }
  }

  // Apply a correction (mark as approved)
  async applyCorrection(correctionId, appliedBy) {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      const correctionRef = doc(db, this.correctionsCollection, correctionId);
      await updateDoc(correctionRef, {
        status: 'approved',
        appliedBy,
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Correction applied:', correctionId);
    } catch (error) {
      console.error('❌ Error applying correction:', error);
      throw new Error('Failed to apply correction');
    }
  }

  // Get corrections for a specific date, mess, and meal (real-time)
  getCorrections(date, mess, meal, callback) {
    if (!this.isFirebaseAvailable()) {
      console.warn('⚠️ Firebase not available, using fallback');
      callback([]);
      return () => {};
    }

    try {
      const dateStr = date instanceof Date ? date.toDateString() : date;
      
      const q = query(
        collection(db, this.correctionsCollection),
        where('date', '==', dateStr),
        where('mess', '==', mess),
        where('meal', '==', meal),
        orderBy('createdAt', 'desc')
      );

      console.log('🔄 Setting up real-time listener for corrections');

      return onSnapshot(q, (snapshot) => {
        const corrections = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          appliedAt: doc.data().appliedAt?.toDate()
        }));
        
        console.log(`📊 Received ${corrections.length} corrections from Firebase`);
        callback(corrections);
      }, (error) => {
        console.error('❌ Error in corrections listener:', error);
        callback([]);
      });
    } catch (error) {
      console.error('❌ Error setting up corrections listener:', error);
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

  // Initialize sample data for Wednesday dinner (one-time setup)
  async initializeSampleData(date, mess) {
    if (!this.isFirebaseAvailable()) {
      return;
    }

    try {
      const dateStr = date instanceof Date ? date.toDateString() : date;
      
      // Check if sample data already exists
      const q = query(
        collection(db, this.correctionsCollection),
        where('date', '==', dateStr),
        where('mess', '==', mess),
        where('meal', '==', 'dinner')
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Add sample correction
        const sampleCorrection = {
          type: 'replace',
          originalItem: 'Chicken Masala/Paneer Butter Masala',
          newItem: 'Chicken Biryani',
          reason: 'Today they served biryani instead of the regular chicken masala - this happens on alternate Wednesdays',
          votes: 8,
          userVotes: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
          reportedBy: 'Community',
          status: 'pending',
          meal: 'dinner',
          date: dateStr,
          mess: mess,
          userId: 'system',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await addDoc(collection(db, this.correctionsCollection), sampleCorrection);
        console.log('✅ Sample correction data initialized for Wednesday dinner');
      }
    } catch (error) {
      console.error('❌ Error initializing sample data:', error);
    }
  }

  // Test Firebase connection
  async testConnection() {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      // Try to read from the corrections collection
      const q = query(collection(db, this.correctionsCollection));
      await getDocs(q);
      
      console.log('✅ Firebase connection test successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const firebaseMenuCorrectionService = new FirebaseMenuCorrectionService();
export default firebaseMenuCorrectionService;