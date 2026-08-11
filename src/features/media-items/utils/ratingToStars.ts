//src/features/media-items/utils/ratingToStars.ts
export function ratingToStars(rating: number | undefined): {
  fullStars: number;
  hasHalfStar: boolean;
} {
  if (!rating) return { fullStars: 0, hasHalfStar: false };

  const starsOutOfFive = rating / 2; // schema stores 0–10, display is 5 stars
  const fullStars = Math.floor(starsOutOfFive);
  const hasHalfStar = starsOutOfFive - fullStars >= 0.5;

  return { fullStars, hasHalfStar };
}
