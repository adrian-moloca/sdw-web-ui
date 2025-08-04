const services = {
  general: [
    {
      code: 'usdm-publisher',
      title: 'USDM Publisher',
      processors: [
        {
          code: 'usdm-publisher/p',
          title: 'Publisher Processor',
          endpoint: '/usdm-publisher/processor',
          logEndpoint: '/usdm-publisher/logs',
        },
      ],
    },
    {
      code: 'usdm-manager',
      title: 'USDM Manager',
      processors: [
        {
          code: 'usdm-manager/layers',
          title: 'Layers Processor',
          endpoint: '/usdm-manager/layers_processor',
          logEndpoint: '/usdm-manager/logs',
        },
        {
          code: 'usdm-manager/reconsolidation',
          title: 'Reconsolidation Processor',
          endpoint: '/usdm-manager/reconsolidation_processor',
          logEndpoint: '/usdm-manager/logs',
        },
      ],
      jobs: [
        {
          code: 'usdm-manager/refresh',
          title: 'Refresh Processor',
          endpoint: '/usdm-manager/refresh',
        },
      ],
    },
    {
      code: 'usdm-model',
      title: 'USDM Model',
      processors: [
        {
          code: 'usdm-model/p',
          title: 'USDM Processor',
          endpoint: '/usdm-model/processor',
          logEndpoint: '/usdm-model/logs',
        },
        {
          code: 'usdm-model/cleanser',
          title: 'USDM Cleanser',
          endpoint: '/usdm-model/cleanser',
          logEndpoint: '/usdm-model/logs',
        },
        {
          code: 'usdm-model/recovery',
          title: 'USDM Recovery',
          endpoint: '/usdm-model/recovery',
          logEndpoint: '/usdm-model/logs',
        },
      ],
      jobs: [
        {
          code: 'usdm-model/reconsolidation',
          title: 'USDM Reconsolidation',
          endpoint: '/usdm-model/reconsolidation',
        },
      ],
    },
    {
      code: 'usdm-consolidation',
      title: 'USDM Consolidation',
      processors: [
        {
          code: 'usdm-consolidation/p',
          title: 'Consolidation Processor',
          endpoint: '/usdm-consolidation/consolidation-service-processor',
          logEndpoint: '/usdm-consolidation/logs',
        },
      ],
    },
    // {
    //   code: 'usdf-ingest',
    //   title: 'USDF Ingest',
    //   processors: [{ code: 'usdf-ingest/p', title: 'USDF Processor', endpoint: '/usdf-ingest-service/processor', logEndpoint: '/usdf-ingest-service/logs' }],
    // },
    {
      code: 'usdf-transform',
      title: 'USDM Transform',
      processors: [
        {
          code: 'usdf-transform/p',
          title: 'Transform Processor',
          endpoint: '/usdf-transform/processor',
        },
      ], //, logEndpoint: '/usdm-transform/logs'  }],
    },
    {
      code: 'usdf-invalidation',
      title: 'USDM Invalidation',
      processors: [
        {
          code: 'usdf-invalidation/p',
          title: 'Invalidation Processor',
          endpoint: '/usdm-invalidation/processor',
          logEndpoint: '/usdm-invalidation/logs',
        },
      ],
    },
    {
      code: 'sdw-log',
      title: 'Log Services',
      processors: [
        {
          code: 'sdw-log/p',
          title: 'Log Processor',
          endpoint: '/log-service/processor',
          logEndpoint: '/log-service/logs',
        },
      ],
    },
    {
      code: 'sdw-Notifications',
      title: 'USDM Notifications',
      processors: [
        {
          code: 'sdw-masterData/p',
          title: 'Notifications',
          endpoint: '/usdm-notification/notifications',
          logEndpoint: '/usdm-notification/logs',
        },
      ],
    },
    {
      code: 'sdw-masterData',
      title: 'Master Data Processor',
      processors: [
        {
          code: 'sdw-masterData/p',
          title: 'Master Data Import',
          endpoint: '/md/import',
          logEndpoint: '/md/logs',
        },
      ],
    },
    {
      code: 'data-ingest',
      title: 'Data Ingest',
      processors: [
        {
          code: 'data-ingest/csv',
          title: 'CSV Processor',
          endpoint: '/data-ingest/csv_processor',
          logEndpoint: '/data-ingest/logs',
        },
        {
          code: 'data-ingest/fiba',
          title: 'FIBA Processor',
          endpoint: '/data-ingest/fiba_processor',
          logEndpoint: '/data-ingest/logs',
        },
        {
          code: 'data-ingest/wa',
          title: 'WA Processor',
          endpoint: '/data-ingest/wa_processor',
          logEndpoint: '/data-ingest/logs',
        },
      ],
    },
  ],
};
export default services;
