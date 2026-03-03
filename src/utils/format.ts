export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} €`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr-FR");
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
