export const aggregateMedals = (input: Array<any>) => {
  return input.reduce((result, item) => {
    const existingResult = result.find((r: any) => r.competition.id === item.competition.id);

    if (existingResult) {
      // If the competition already exists in the result array, update the counts
      existingResult.golden += item.golden;
      existingResult.silver += item.silver;
      existingResult.bronze += item.bronze;
    } else {
      // If the competition doesn't exist in the result array, add it
      result.push({
        competition: item.competition,
        golden: item.golden,
        silver: item.silver,
        bronze: item.bronze,
      });
    }

    return result;
  }, []);
};
