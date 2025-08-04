export const hasInfo = (data: any): boolean => {
  return (
    data.dam ||
    data.breeder ||
    data.owner ||
    data.secondOwner ||
    data.website ||
    data.generalBiography ||
    data.competingBiography ||
    data.studBook ||
    data.summary ||
    data.awards ||
    data.training
  );
};
