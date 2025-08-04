import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import isEqual from 'lodash/isEqual';
import { DisplayEntry, Entry, MasterData, MasterDataCategory, MetaField } from 'models';

type IMasterDataInfo = {
  [key in MasterDataCategory]: Array<Entry>;
};
export interface IDataState extends IMasterDataInfo {
  reports: Array<any>;
  editions: Array<DisplayEntry>;
  categories: Array<DisplayEntry>;
  reportSources: Array<DisplayEntry>;
  sources: Array<DisplayEntry>;
  metaFields: Array<MetaField>;
  hasHidden?: boolean;
}
export interface MasterPayload {
  data: Array<Entry>;
  category: MasterDataCategory;
}

const name = 'SDW_Share Data';
const initialState: IDataState = {
  reports: [],
  editions: [],
  categories: [],
  reportSources: [],
  hasHidden: false,
  metaFields: [],
  sources: [],
  ...Object.values(MasterData).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as IMasterDataInfo),
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setReport: (state, action: PayloadAction<Array<any>>) => {
      if (!action.payload) return state;
      if (action.payload.length == 0) return state;
      const updatedArray = [...state.reports];
      action.payload.forEach((element) => {
        if (!updatedArray.some((item) => isEqual(item, element))) {
          updatedArray.push(element);
        }
      });
      return { ...state, report: updatedArray };
    },
    setEditions: (state, action: PayloadAction<Array<DisplayEntry>>) => {
      if (!action.payload) return state;
      if (action.payload.length == 0) return state;
      return { ...state, editions: action.payload };
    },
    setReportSources: (state, action: PayloadAction<Array<DisplayEntry>>) => {
      if (!action.payload) return state;
      if (action.payload.length == 0) return state;
      return { ...state, reportSources: action.payload };
    },
    setCategories: (state, action: PayloadAction<Array<DisplayEntry>>) => {
      if (!action.payload) return state;
      if (action.payload.length == 0) return state;
      return { ...state, categories: action.payload };
    },
    setMasterData: (state, action: PayloadAction<MasterPayload>) => {
      if (!action.payload) return state;
      if (action.payload.data.length == 0) return state;
      return { ...state, [action.payload.category]: action.payload.data };
    },
    setSources: (state, action: PayloadAction<Array<DisplayEntry>>) => {
      if (!action.payload) return state;
      if (action.payload.length == 0) return state;
      return { ...state, sources: action.payload };
    },
    setMetaFields: (state, action: PayloadAction<Array<MetaField>>) => {
      if (!action.payload) return state;
      if (action.payload.length == 0) return state;
      return { ...state, metaFields: action.payload };
    },
    clearOneReport: (state, action: PayloadAction<string>) => {
      const updateReport = state.reports.filter((a) => a.key !== action.payload);
      return { ...state, reports: updateReport, hasHidden: false };
    },
    clearReport: (state) => {
      return { ...state, reports: [] };
    },
    clearNocs: (state) => {
      return { ...state, nocs: [] };
    },
    clearEditions: (state) => {
      return { ...state, editions: [] };
    },
    clear: (state) => {
      return {
        ...state,
        editions: [],
        categories: [],
        reportSources: [],
        sources: [],
        ...Object.values(MasterData).reduce((acc, key) => {
          acc[key] = [];
          return acc;
        }, {} as IMasterDataInfo),
      };
    },
  },
});
export const dataReducer = slice.reducer;
export const dataActions = slice.actions;
