export const hasInfo = (data: any): boolean => {
  return (
    data.website ||
    data.generalBiography ||
    data.competingBiography ||
    data.summary ||
    data.awards ||
    data.training
  );
};
