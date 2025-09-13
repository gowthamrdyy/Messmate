import { useState, useEffect } from 'react';
import communityRatings from '../services/communityRatings';

// Hook to get rating for a specific item in meal context
export const useItemRating = (itemName, mess, day, meal) => {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemName || !mess || !day || !meal) {
      setRating(null);
      return;
    }

    const loadRating = async () => {
      setLoading(true);
      try {
        const itemRating = await communityRatings.getRating(itemName, mess, day, meal);
        setRating(itemRating);
      } catch (error) {
        console.error('Error loading rating:', error);
        setRating(null);
      } finally {
        setLoading(false);
      }
    };

    loadRating();
  }, [itemName, mess, day, meal]);

  return { rating, loading };
};

// Hook to get ratings for multiple items in the same meal context
export const useMealRatings = (items, mess, day, meal) => {
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!items?.length || !mess || !day || !meal) {
      setRatings({});
      return;
    }

    const loadRatings = async () => {
      setLoading(true);
      try {
        const ratingPromises = items.map(async (item) => {
          const rating = await communityRatings.getRating(item, mess, day, meal);
          return [item, rating];
        });

        const results = await Promise.all(ratingPromises);
        const ratingsMap = Object.fromEntries(results.filter(([_, rating]) => rating !== null));
        setRatings(ratingsMap);
      } catch (error) {
        console.error('Error loading ratings:', error);
        setRatings({});
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [items, mess, day, meal]);

  return { ratings, loading };
};