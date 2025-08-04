import { StructureType } from 'types/ingestion';

interface AdditionalInfo {
  level: StructureType;
  code: string;
  name: string;
  order: number;
  type?: string;
  levelOrder?: string;
}
export const extractAdditionalInfo = (data: any) => {
  const additionalInfo: { level: StructureType; code: any; name: any; order: any; type?: any }[] =
    [];

  data.events.forEach((event: any) => {
    addInfo(additionalInfo, 'event', event.code, event.title, event.order);

    event.stages.forEach((stage: any) => {
      const stageOrder = `${event.order}.${stage.order}`;
      addInfo(
        additionalInfo,
        'stage',
        stage.code,
        stage.title,
        stage.order,
        stage.type,
        stageOrder
      );
      stage.phases.forEach((phase: any) => {
        const phaseOrder = `${stageOrder}.${phase.order}`;
        addInfo(
          additionalInfo,
          'phase',
          phase.code,
          phase.title,
          phase.order,
          phase.round,
          phaseOrder
        );
        extractUnits(phase.units, additionalInfo, phaseOrder);
      });
    });

    event.phases.forEach((phase: any) => {
      const phaseOrder = `${event.order}.${phase.order}`;
      addInfo(
        additionalInfo,
        'phase',
        phase.code,
        phase.title,
        phase.order,
        phase.round,
        phaseOrder
      );
      extractUnits(phase.units, additionalInfo, phaseOrder);
    });
  });

  return additionalInfo;
};

const addInfo = (
  additionalInfo: AdditionalInfo[],
  level: StructureType,
  code: string,
  name: string,
  order: number,
  type?: string,
  levelOrder?: string
) => {
  additionalInfo.push({ level, code, name, order, type, levelOrder });
};

const extractSubunits = (subunits: any[], additionalInfo: any[], order?: string) => {
  subunits.forEach((subunit: any) => {
    addInfo(
      additionalInfo,
      'subunit',
      subunit.code,
      subunit.title,
      subunit.order,
      subunit.type,
      `${order}.${subunit.order}`
    );
  });
};

const extractUnits = (units: any[], additionalInfo: AdditionalInfo[], order?: string) => {
  units.forEach((unit: any) => {
    const unitOrder = `${order}.${unit.order}`;
    addInfo(additionalInfo, 'unit', unit.code, unit.title, unit.order, unit.type, unitOrder);

    if (unit.subunits) {
      extractSubunits(unit.subunits, additionalInfo);
    }
  });
};

export const filterRuleWithCondition = (data: any, condition: (item: any) => boolean) => {
  const filteredEvents: any[] = [];
  data.forEach((rule: any) => {
    let hasMatching = false;

    hasMatching = hasMatching || rule.nextRules.some((y: any) => condition(y));

    if (hasMatching) {
      filteredEvents.push(rule);
    }
  });

  return filteredEvents;
};

// Main function to filter events based on a condition at multiple levels
export const filterEventsWithCondition = (data: any, condition: (item: any) => boolean) => {
  const filteredEvents: any[] = [];
  data.forEach((event: any) => {
    let hasMatching = false;

    hasMatching = hasMatching || checkStages(event.stages, condition);
    hasMatching = hasMatching || checkPhases(event.phases, condition);

    if (hasMatching) {
      filteredEvents.push(event);
    }
  });

  return filteredEvents;
};

const checkStages = (stages: any[], condition: (item: any) => boolean) => {
  return stages.some((stage) => {
    return stage.phases.some((phase: any) => {
      return checkPhase(phase, condition);
    });
  });
};

const checkPhases = (phases: any[], condition: (item: any) => boolean) => {
  return phases.some((phase) => {
    return checkPhase(phase, condition);
  });
};

const checkPhase = (phase: any, condition: (item: any) => boolean) => {
  let hasMatching = false;

  phase.units.forEach((unit: any) => {
    if (condition(unit)) {
      hasMatching = true;
    }
    hasMatching = hasMatching || checkSubunits(unit.subunits, condition);
  });

  return hasMatching;
};

const checkSubunits = (subunits: any[], condition: (item: any) => boolean) => {
  return subunits.some((subunit) => condition(subunit));
};

export const removeDashes = (input?: string): string => {
  return input?.replace(/--+/g, '') ?? ''; // Replace occurrences of -- with an empty string
};

export const extractAllCodes = (data: any) => {
  const codes: string[] = [];

  const traverse = (item: any, prefix?: string) => {
    // Add the current item's code if it exists
    if (item.code) {
      if (prefix) codes.push(`${prefix}${item.code}`);
      else codes.push(item.code);
    }

    // If there are stages, traverse each stage
    if (item.stages) {
      item.stages.forEach((stage: any) => traverse(stage, 'stage_'));
    }

    // If there are phases, traverse each phase
    if (item.phases) {
      item.phases.forEach(traverse);
    }

    // If there are units, traverse each unit
    if (item.units) {
      item.units.forEach(traverse);
    }

    // If there are subunits, traverse each subunit
    if (item.subunits) {
      item.subunits.forEach(traverse);
    }
  };
  // Start traversing from the root events
  data.events.forEach(traverse);

  return codes;
};

export const getUnits = (data: any): any[] => {
  // Extract units from both phases directly and from stages' phases
  const units = data.events.flatMap((event: any) => {
    const phaseUnits = event.phases.flatMap((phase: any) => phase.units ?? []);
    const stageUnits = event.stages.flatMap((stage: any) =>
      stage.phases.flatMap((phase: any) => phase.units ?? [])
    );
    return [...phaseUnits, ...stageUnits];
  });

  return units.filter(Boolean); // Remove undefined or null values
};

export const getSubunits = (data: any): any[] => {
  // Extract subunits from units inside phases and stages
  const subunits = data.events.flatMap((event: any) => {
    const phaseSubunits = event.phases.flatMap((phase: any) =>
      phase.units.flatMap((unit: any) => unit.subunits ?? [])
    );
    function getSubunitsFromUnit(unit: any): any[] {
      return unit.subunits ?? [];
    }

    function getSubunitsFromPhase(phase: any): any[] {
      return phase.units.flatMap(getSubunitsFromUnit);
    }

    function getSubunitsFromStage(stage: any): any[] {
      return stage.phases.flatMap(getSubunitsFromPhase);
    }

    const stageSubunits = event.stages.flatMap(getSubunitsFromStage);
    return [...phaseSubunits, ...stageSubunits];
  });

  return subunits.filter(Boolean); // Remove undefined or null values
};

export const getPhases = (data: any): any[] => {
  // Extract phases from both events directly and stages
  const phases = data.events.flatMap((event: any) => {
    const eventPhases = event.phases ?? [];
    const stagePhases = event.stages.flatMap((stage: any) => stage.phases ?? []);
    return [...eventPhases, ...stagePhases];
  });

  return phases.filter(Boolean); // Remove undefined or null values
};

export const getStages = (data: any): any[] => {
  // Extract stages directly from events
  const stages = data.events.flatMap((event: any) => {
    // Return stages for each event
    return event.stages ?? [];
  });

  return stages; // Return the array of stages
};
