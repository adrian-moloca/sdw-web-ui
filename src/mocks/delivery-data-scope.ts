import { DeliveryDataScopeResponse, DeliveryStatusBreakDown } from 'types/delivery-data-scope';

const mockedIngestionDeliveryStatus = {
  fullyReceived: { count: 90, readinessPercentage: 48 },
  notReceived: { count: 30, readinessPercentage: 12 },
  partiallyReceived: { count: 40, readinessPercentage: 25 },
  partiallyReceivedWithErrors: { count: 20, readinessPercentage: 15 },
};

const mockedCompetitionsDeliveryStatus = {
  fullyReceived: { count: 180, readinessPercentage: 81 },
  notReceived: { count: 15, readinessPercentage: 6 },
  partiallyReceived: { count: 52, readinessPercentage: 10 },
  partiallyReceivedWithErrors: { count: 8, readinessPercentage: 3 },
};

const mockedIngestionDeliveryStatusBreakDown: DeliveryStatusBreakDown[] = [
  {
    competitionId: 'ING-001',
    competitionName: 'Ingestion Archive One',
    competitionCategories: ['ARCHIVE'],
    disciplineCode: 'DSP-NORDIC',
    disciplineName: 'Nordic Combined',
    fromYear: '2015',
    toYear: '2019',
    country: 'CNTR$SWE',
    frequency: 3,
    scope: [
      { scopeType: 'pools', status: 'partiallyReceived', readinessPercentage: 45 },
      { scopeType: 'medallists', status: 'fullyReceived', readinessPercentage: 100 },
    ],
  },
  {
    competitionId: 'ING-002',
    competitionName: 'Preliminary Data Set',
    competitionCategories: ['QUALIFIERS'],
    disciplineCode: 'DSP-BMX',
    disciplineName: 'BMX Racing',
    fromYear: '2021',
    toYear: '2022',
    country: 'CNTR$BRA',
    frequency: 1,
    scope: [
      { scopeType: 'results', status: 'notReceived', readinessPercentage: 0 },
      { scopeType: 'relay', status: 'partiallyReceivedWithErrors', readinessPercentage: 25 },
    ],
  },
  {
    competitionId: 'ING-003',
    competitionName: 'Midterm Reports Group C',
    competitionCategories: ['INTERMEDIATE'],
    disciplineCode: 'DSP-FREESTYLE',
    disciplineName: 'Freestyle Skiing',
    fromYear: '2019',
    toYear: '2023',
    country: 'CNTR$USA',
    frequency: 2,
    scope: [
      { scopeType: 'seasonalStandings', status: 'partiallyReceived', readinessPercentage: 55 },
      { scopeType: 'ranking', status: 'partiallyReceivedWithErrors', readinessPercentage: 35 },
    ],
  },
  {
    competitionId: 'ING-004',
    competitionName: 'Athlete Performance Logs',
    competitionCategories: ['DEVELOPMENT'],
    disciplineCode: 'DSP-SNOWBOARD',
    disciplineName: 'Snowboard',
    fromYear: '2020',
    toYear: '2023',
    country: 'CNTR$CAN',
    frequency: 2,
    scope: [
      { scopeType: 'results', status: 'fullyReceived', readinessPercentage: 100 },
      { scopeType: 'relay', status: 'fullyReceived', readinessPercentage: 100 },
    ],
  },
];

const mockedCompetitionsDeliveryStatusBreakDown: DeliveryStatusBreakDown[] = [
  {
    competitionId: 'CMP-001',
    competitionName: 'Winter Nationals',
    competitionCategories: ['OLYMPIC GAMES'],
    disciplineCode: 'DSP-SKATING',
    disciplineName: 'Figure Skating',
    fromYear: '2018',
    toYear: '2022',
    country: 'CNTR$JPN',
    frequency: 4,
    region: 'Asia',
    lastDataReceivedOn: '2024-02-15T00:00:00Z',
    comments: 'All data validated by analyst team.',
    scope: [
      { scopeType: 'results', status: 'fullyReceived', readinessPercentage: 100 },
      { scopeType: 'teamMembers', status: 'fullyReceived', readinessPercentage: 100 },
    ],
  },
  {
    competitionId: 'CMP-002',
    competitionName: 'Continental Cup',
    competitionCategories: ['WORLD CUP'],
    disciplineCode: 'DSP-ICEHOCKEY',
    disciplineName: 'Ice Hockey',
    fromYear: '2020',
    toYear: '2024',
    country: 'CNTR$FIN',
    frequency: 1,
    region: 'Europe',
    lastDataReceivedOn: '2023-11-28T00:00:00Z',
    comments: 'Pending verification of second round rankings.',
    scope: [
      { scopeType: 'results', status: 'partiallyReceived', readinessPercentage: 65 },
      { scopeType: 'ranking', status: 'partiallyReceivedWithErrors', readinessPercentage: 20 },
    ],
  },
  {
    competitionId: 'CMP-003',
    competitionName: 'Global Winter Trials',
    competitionCategories: ['CHAMPIONSHIP'],
    disciplineCode: 'DSP-CROSS',
    disciplineName: 'Cross-Country Skiing',
    fromYear: '2023',
    toYear: '2024',
    country: 'CNTR$SUI',
    frequency: 2,
    region: 'Europe',
    lastDataReceivedOn: '2024-01-20T00:00:00Z',
    comments: 'Awaiting seasonal rankings integration.',
    scope: [{ scopeType: 'seasonalRankings', status: 'notReceived', readinessPercentage: 0 }],
  },
  {
    competitionId: 'CMP-004',
    competitionName: 'Spring Series Finale',
    competitionCategories: ['WORLD CHAMPIONSHIP'],
    disciplineCode: 'DSP-BIATHLON',
    disciplineName: 'Biathlon',
    fromYear: '2022',
    toYear: '2024',
    country: 'CNTR$NOR',
    frequency: 2,
    region: 'Europe',
    lastDataReceivedOn: '2024-03-10T00:00:00Z',
    comments: 'Relay stats approved, medals under review.',
    scope: [
      { scopeType: 'medallists', status: 'partiallyReceived', readinessPercentage: 55 },
      { scopeType: 'relay', status: 'fullyReceived', readinessPercentage: 100 },
    ],
  },
];

const mockedApiResponse: DeliveryDataScopeResponse = {
  content: [
    {
      ingestionDeliveryStatus: mockedIngestionDeliveryStatus,
      competitionsDeliveryStatus: mockedCompetitionsDeliveryStatus,
      deliveryStatusBreakDown: [
        ...mockedIngestionDeliveryStatusBreakDown,
        ...mockedCompetitionsDeliveryStatusBreakDown,
      ],
      ingestionDeliveryStatusBreakDown: [...mockedIngestionDeliveryStatusBreakDown],
      competitionsDeliveryStatusBreakDown: [...mockedCompetitionsDeliveryStatusBreakDown],
      edition: { id: 'edition-456', name: 'Winter Edition 2025' },
    },
  ],
  pagination: {
    rows: 25,
    start: 0,
    total: 25,
  },
};

export {
  mockedIngestionDeliveryStatus,
  mockedCompetitionsDeliveryStatus,
  mockedIngestionDeliveryStatusBreakDown,
  mockedCompetitionsDeliveryStatusBreakDown,
  mockedApiResponse,
};
