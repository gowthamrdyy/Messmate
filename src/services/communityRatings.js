// Community Rating System - Firebase-powered meal-specific ratings
// Ratings are organized by mess -> day -> meal -> item
import firebaseRatings from './firebaseRatings';

class CommunityRatingService {
  constructor() {
    // Use Firebase service for all operations
    this.firebase = firebaseRatings;
  }

  // Get all community ratings
  async getAllRatings() {
    return await this.firebase.getAllRatings();
  }

  // Save ratings to storage
  async saveRatings(ratings) {
    await this.firebase.saveRatings(ratings);
  }

  // Get rating for a specific item in a specific meal context
  async getRating(itemName, mess, day, meal) {
    return await this.firebase.getRating(itemName, mess, day, meal);
  }

  // Add or update a rating for a specific meal context
  async addRating(itemName, userRating, mess, day, meal) {
    return await this.firebase.addRating(itemName, userRating, mess, day, meal);
  }

  // Get statistics for all ratings
  async getStats() {
    return await this.firebase.getStats();
  }

  // Get current meal context from date and meal info
  getCurrentMealContext(date, mealName) {
    return this.firebase.getCurrentMealContext(date, mealName);
  }
}

// Create and export a singleton instance
const communityRatings = new CommunityRatingService();
export default communityRatings;