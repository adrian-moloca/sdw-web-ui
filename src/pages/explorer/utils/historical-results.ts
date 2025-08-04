import { Entry } from 'models';

export const filterData = (data: Array<any>, selectedCategories: Array<Entry>) => {
  return data?.filter((item) => {
    if (selectedCategories.length === 0) {
      return true;
    }

    const categories = selectedCategories.map((category) => category.key);
    const isCategorySelected =
      item.competition.categories == undefined ||
      item.competition.categories.some((cat: string) => categories.includes(cat));

    return isCategorySelected;
  });
};
