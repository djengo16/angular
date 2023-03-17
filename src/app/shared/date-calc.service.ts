export const calculateExpiryDate = (expiresIn: number) =>
  new Date(new Date().getTime() + expiresIn * 1000);
