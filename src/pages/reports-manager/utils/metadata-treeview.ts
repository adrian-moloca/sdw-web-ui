import { EnumType, useEnums } from 'models';

export const extractAllCodes = (data: any) => {
  const { getEnumValues } = useEnums();
  const codes: string[] = getEnumValues(EnumType.SectionType).map((x) => x.code);

  const traverse = (item: any) => {
    // Add the current item's code if it exists
    if (item.id) {
      codes.push(item.id);
    }
    if (item.blocks) {
      item.blocks.forEach(traverse);
    }
  };
  // Start traversing from the root events
  data.sections.forEach((e: any) => traverse(e));

  return codes;
};
