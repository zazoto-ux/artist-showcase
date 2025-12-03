import { IMAGE_SIZE } from "../constants/common";

export const getImageUrl = (size: (typeof IMAGE_SIZE)[keyof typeof IMAGE_SIZE], imageArr: ArtistImage[] | undefined) => {
  if (!Array.isArray(imageArr) || !size) return "";

  let imageUrl = imageArr?.find(img => img.size === size)?.text;
  return imageUrl;
};

export const formatImages = (imgArr: any[]): ArtistImage[] => {
  if (!Array.isArray(imgArr)) return [];

  let imageUrl = imgArr.map((img) => ({size: img.size, text: img["#text"]}));
  return imageUrl;
};