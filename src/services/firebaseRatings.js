// Firebase service for real-time community ratings
// This will be configured with your Firebase project after deployment

class FirebaseRatingsService {
  constructor() {
    this.isFirebaseConfigured = false;
    this.localStorageKey = 'messmate_community_ratings';
    
    // Check if Firebase is available
    this.checkFirebaseConfig();
  }

  checkFirebaseConfig() {
    // This will be updated with actual Firebase config
    // For now, use localStorage as fallback
    this.isFirebaseConfigured = false;
  }

  // Get all ratings (Firebase or localStorage)
  async getAllRatings() {
    if (this.isFirebaseConfigured) {
      // TODO: Implement Firebase Firestore read
      // return await this.getFirebaseRatings();
    }
    
    // Fallback to localStorage
    try {
      const ratings = localStorage.getItem(this.localStorageKey);
      return ratings ? JSON.parse(ratings) : {};
    } catch (error) {
      console.error('Error loading ratings:', error);
      return {};
    }
  }

  // Save ratings (Firebase or localStorage)
  async saveRatings(ratings) {
    if (this.isFirebaseConfigured) {
      // TODO: Implement Firebase Firestore write
      // await this.saveFirebaseRatings(ratings);
    }
    
    // Always save to localStorage as backup
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(ratings));
    } catch (error) {
      console.error('Error saving ratings:', error);
    }
  }

  // Get rating for specific meal context
  async getRating(itemName, mess, day, meal) {
    if (!mess || !day || !meal) return null;
    
    const ratings = await this.getAllRatings();
    const cleanName = itemName.replace(/\*\*/g, '').trim();
    const mealKey = `${mess}_${day}_${meal}`;
    
    if (ratings[mealKey] && ratings[mealKey][cleanName]) {
      return ratings[mealKey][cleanName];
    }
    
    return null;
  }

  // Add rating for specific meal context
  async addRating(itemName, userRating, mess, day, meal) {
    if (!mess || !day || !meal) return null;
    
    const cleanName = itemName.replace(/\*\*/g, '').trim();
    const ratings = await this.getAllRatings();
    const mealKey = `${mess}_${day}_${meal}`;
    
    // Initialize meal context if it doesn't exist
    if (!ratings[mealKey]) {
      ratings[mealKey] = {};
    }
    
    if (ratings[mealKey][cleanName]) {
      // Update existing rating
      const current = ratings[mealKey][cleanName];
      const totalRating = current.rating * current.count + userRating;
      const newCount = current.count + 1;
      ratings[mealKey][cleanName] = {
        rating: Math.round((totalRating / newCount) * 10) / 10,
        count: newCount,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // New rating
      ratings[mealKey][cleanName] = {
        rating: userRating,
        count: 1,
        lastUpdated: new Date().toISOString()
      };
    }
    
    await this.saveRatings(ratings);
    return ratings[mealKey][cleanName];
  }

  // Get statistics
  async getStats() {
    const ratings = await this.getAllRatings();
    let totalItems = 0;
    let totalRatings = 0;
    let weightedSum = 0;
    
    Object.values(ratings).forEach(mealRatings => {
      Object.values(mealRatings).forEach(item => {
        totalItems++;
        totalRatings += item.count;
        weightedSum += item.rating * item.count;
      });
    });
    
    const averageRating = totalRatings > 0 ? Math.round((weightedSum / totalRatings) * 10) / 10 : 0;
    
    return {
      totalItems,
      totalRatings,
      averageRating
    };
  }

  // Get current meal context
  getCurrentMealContext(date, mealName) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = days[date.getDay()];
    const meal = mealName.toLowerCase();
    return { day, meal };
  }

  // Future: Initialize Firebase
  async initializeFirebase(config) {
    try {
      // TODO: Initialize Firebase with provided config
      // const app = initializeApp(config);
      // this.db = getFirestore(app);
      this.isFirebaseConfigured = true;
      console.log('Firebase initialized for ratings');
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      this.isFirebaseConfigured = false;
    }
  }

  // Future: Firebase Firestore operations
  async getFirebaseRatings() {
    // TODO: Implement Firestore read
    // const ratingsRef = collection(this.db, 'ratings');
    // const snapshot = await getDocs(ratingsRef);
    // return snapshot data
  }

  async saveFirebaseRatings(ratings) {
    // TODO: Implement Firestore write
    // const ratingsRef = doc(this.db, 'ratings', 'community');
    // await setDoc(ratingsRef, ratings, { merge: true });
  }
}

// Create singleton instance
const firebaseRatings = new FirebaseRatingsService();
export default firebaseRatings;