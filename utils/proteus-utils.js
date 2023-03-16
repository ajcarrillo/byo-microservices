/**
 * Resolves a controller's rating
 * @param {number} highestRating The highest rating for any controller
 * @param {number} rating This controllers rating
 * @return {number} The rating
 */
const resolveProteusControllerRating = (highestRating, rating) => {
  const ratingThreshold = highestRating / 5
  const threshold1 = ratingThreshold
  const threshold2 = ratingThreshold * 2
  const threshold3 = ratingThreshold * 3
  const threshold4 = ratingThreshold * 4

  if (rating === 0) {
    return 0
  } else if (rating > 0 && rating <= threshold1) {
    return 1
  } else if (rating > threshold1 && rating <= threshold2) {
    return 2
  } else if (rating > threshold2 && rating <= threshold3) {
    return 3
  } else if (rating > threshold3 && rating <= threshold4) {
    return 4
  } else {
    return 5
  }
}

export {
  resolveProteusControllerRating,
}
