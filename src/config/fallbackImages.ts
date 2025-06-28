export const FALLBACK_IMAGES = {
  default:
    'https://res.cloudinary.com/dp1zblmv4/image/upload/v1751075414/partybank/jyvemoyskt5dnhatk9zw.png',
  event:
    'https://res.cloudinary.com/dp1zblmv4/image/upload/v1751075414/partybank/jyvemoyskt5dnhatk9zw.png',
  series:
    'https://res.cloudinary.com/dp1zblmv4/image/upload/v1751075414/partybank/jyvemoyskt5dnhatk9zw.png',
  user: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
};

// You can easily change these URLs to update fallback images across the entire app
export const getFallbackImage = (type: keyof typeof FALLBACK_IMAGES = 'default') => {
  return FALLBACK_IMAGES[type];
};
