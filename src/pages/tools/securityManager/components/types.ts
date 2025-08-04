export type User = {
  id: string;
  username: string;
  givenName: string;
  lastName: string;
  mail: string;
  environment: string;
  createdOn: string;
  status: string;
  groups: string;
  company?: string;
};

export type AugmentedUser = User & {
  dataProfiles: string[];
  operationsProfiles: string[];
};
export type ApiClient = {
  realm: string;
  clientId: string;
  clientName: string;
  status: string;
  description?: string;
  defaultScopes: string;
  scopes: string;
  environment: string;
  agentGroup: string;
};
export type AugmentedApiClient = ApiClient & {
  dataProfiles: string[];
  operationsProfiles: string[];
};
