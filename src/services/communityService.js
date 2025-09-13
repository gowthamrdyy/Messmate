import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  increment,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

class CommunityService {
  constructor() {
    this.collections = {
      ratings: 'dish_ratings',
      reviews: 'dish_reviews', 
      activity: 'community_activity',
      popularity: 'dish_popularity',
      availability: 'dish_availability'
    };
  }

  // RATINGS & REVIEWS
  async rateDish(dishName, rating, userId = 'anonymous', mess = 'sannasi') {
    try {
      const ratingData = {
        dishName: dishName.toLowerCase().trim(),
        rating: Math.max(1, Math.min(5, rating)), // Ensure 1-5 range
        userId,
        mess,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      };

      await addDoc(collection(db, this.collections.ratings), ratingData);
      
      // Update popularity counter
      await this.updatePopularity(dishName, mess, 'rating');
      
      // Add to activity feed
      await this.addActivity({
        type: 'rating',
        dishName,
        rating,
        mess,
        userId
      });

      return { success: true };
    } catch (error) {
      console.error('Error rating dish:', error);
      return { success: false, error: error.message };
    }
  }

  async addReview(dishName, review, rating, userId = 'anonymous', mess = 'sannasi') {
    try {
      const reviewData = {
        dishName: dishName.toLowerCase().trim(),
        review: review.trim(),
        rating: Math.max(1, Math.min(5, rating)),
        userId,
        mess,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };

      await addDoc(collection(db, this.collections.reviews), reviewData);
      
      // Update popularity
      await this.updatePopularity(dishName, mess, 'review');
      
      // Add to activity feed
      await this.addActivity({
        type: 'review',
        dishName,
        review: review.substring(0, 50) + (review.length > 50 ? '...' : ''),
        rating,
        mess,
        userId
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding review:', error);
      return { success: false, error: error.message };
    }
  }

  // Get average rating for a dish
  async getDishRating(dishName, mess = 'sannasi') {
    try {
      const q = query(
        collection(db, this.collections.ratings),
        where('dishName', '==', dishName.toLowerCase().trim()),
        where('mess', '==', mess)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return { average: 0, count: 0 };
      }

      let total = 0;
      let count = 0;
      
      snapshot.forEach(doc => {
        total += doc.data().rating;
        count++;
      });

      return {
        average: Math.round((total / count) * 10) / 10, // Round to 1 decimal
        count
      };
    } catch (error) {
      console.error('Error getting dish rating:', error);
      return { average: 0, count: 0 };
    }
  }

  // Get reviews for a dish
  async getDishReviews(dishName, mess = 'sannasi', limitCount = 10) {
    try {
      const q = query(
        collection(db, this.collections.reviews),
        where('dishName', '==', dishName.toLowerCase().trim()),
        where('mess', '==', mess),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const reviews = [];
      
      snapshot.forEach(doc => {
        reviews.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return reviews;
    } catch (error) {
      console.error('Error getting dish reviews:', error);
      return [];
    }
  }

  // POPULARITY TRACKING
  async updatePopularity(dishName, mess, action) {
    try {
      const docId = `${dishName.toLowerCase().trim()}_${mess}`;
      const docRef = doc(db, this.collections.popularity, docId);
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          [`${action}Count`]: increment(1),
          lastUpdated: serverTimestamp()
        });
      } else {
        const data = {
          dishName: dishName.toLowerCase().trim(),
          mess,
          ratingCount: action === 'rating' ? 1 : 0,
          reviewCount: action === 'review' ? 1 : 0,
          favoriteCount: action === 'favorite' ? 1 : 0,
          searchCount: action === 'search' ? 1 : 0,
          lastUpdated: serverTimestamp()
        };
        await setDoc(docRef, data);
      }
    } catch (error) {
      console.error('Error updating popularity:', error);
    }
  }

  // Get popular dishes
  async getPopularDishes(mess = 'sannasi', limitCount = 10) {
    try {
      const q = query(
        collection(db, this.collections.popularity),
        where('mess', '==', mess),
        orderBy('ratingCount', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const popular = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        popular.push({
          dishName: data.dishName,
          totalInteractions: (data.ratingCount || 0) + (data.reviewCount || 0) + (data.favoriteCount || 0),
          ...data
        });
      });

      return popular;
    } catch (error) {
      console.error('Error getting popular dishes:', error);
      return [];
    }
  }

  // ACTIVITY FEED
  async addActivity(activityData) {
    try {
      const activity = {
        ...activityData,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      };

      await addDoc(collection(db, this.collections.activity), activity);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  }

  // Get recent activity
  async getRecentActivity(mess = 'sannasi', limitCount = 20) {
    try {
      const q = query(
        collection(db, this.collections.activity),
        where('mess', '==', mess),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const activities = [];
      
      snapshot.forEach(doc => {
        activities.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return activities;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  // REAL-TIME LISTENERS
  subscribeToActivity(mess = 'sannasi', callback, limitCount = 10) {
    const q = query(
      collection(db, this.collections.activity),
      where('mess', '==', mess),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
      const activities = [];
      snapshot.forEach(doc => {
        activities.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(activities);
    });
  }

  subscribeToPopularity(mess = 'sannasi', callback, limitCount = 10) {
    const q = query(
      collection(db, this.collections.popularity),
      where('mess', '==', mess),
      orderBy('ratingCount', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
      const popular = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        popular.push({
          dishName: data.dishName,
          totalInteractions: (data.ratingCount || 0) + (data.reviewCount || 0) + (data.favoriteCount || 0),
          ...data
        });
      });
      callback(popular);
    });
  }

  // DISH AVAILABILITY (Real-time updates from mess staff or community)
  async updateDishAvailability(dishName, isAvailable, mess = 'sannasi', userId = 'anonymous') {
    try {
      const docId = `${dishName.toLowerCase().trim()}_${mess}_${new Date().toISOString().split('T')[0]}`;
      const docRef = doc(db, this.collections.availability, docId);
      
      await setDoc(docRef, {
        dishName: dishName.toLowerCase().trim(),
        isAvailable,
        mess,
        updatedBy: userId,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      });

      // Add to activity feed
      await this.addActivity({
        type: 'availability',
        dishName,
        isAvailable,
        mess,
        userId
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating dish availability:', error);
      return { success: false, error: error.message };
    }
  }

  async getDishAvailability(dishName, mess = 'sannasi') {
    try {
      const today = new Date().toISOString().split('T')[0];
      const docId = `${dishName.toLowerCase().trim()}_${mess}_${today}`;
      const docRef = doc(db, this.collections.availability, docId);
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      
      return null; // No availability data
    } catch (error) {
      console.error('Error getting dish availability:', error);
      return null;
    }
  }

  // UTILITY METHODS
  async trackSearch(searchTerm, mess = 'sannasi') {
    if (searchTerm.trim().length > 2) {
      await this.updatePopularity(searchTerm, mess, 'search');
    }
  }

  async trackFavorite(dishName, mess = 'sannasi') {
    await this.updatePopularity(dishName, mess, 'favorite');
  }
}

// Create singleton instance
const communityService = new CommunityService();
export default communityService;