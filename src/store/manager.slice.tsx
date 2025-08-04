import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IEdition {
  id?: string;
  code?: string;
  country?: string;
  description?: string;
  finishDate?: Date;
  name?: string;
  region?: string;
  startDate?: Date;
  type?: string;
}
export interface IManagerSetup {
  currentEdition?: IEdition;
  defaultDisciplines?: string[];
  defaultFormat: string;
  deliveryFolder?: string;
  deliveryRate?: number;
  deliveryUrl?: string;
  fileNamingConvention?: string;
  finalDelivery?: Date;
  initialDelivery?: Date;
  nextDelivery?: Date;
  notificationUsers?: string[];
  outputFolder?: string;
  rate?: number;
  dataRate?: number;
}
const name = 'manager';
const initialState: IManagerSetup = createInitialState();

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setSetup: (_state, action: PayloadAction<IManagerSetup>) => {
      return action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
});

// exports
export const managerActions = { ...slice.actions };
export const managerReducer = slice.reducer;
export const managerSelector = (state: IManagerSetup) => state;

function createInitialState(): IManagerSetup {
  return {
    currentEdition: {},
    defaultFormat: 'xml',
  };
}
