import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EntityType, MetadataModel } from 'models';

export type IMetadataDataEntity = {
  key: EntityType;
  model: { [key: string]: MetadataModel };
};
export interface IMetadataState {
  data: Array<IMetadataDataEntity>;
  hidden: Array<string>;
  hasHidden: boolean;
}

const name = 'metadata';
const initialState: IMetadataState = {
  data: [],
  hidden: [],
  hasHidden: false,
};
const slice = createSlice({
  name,
  initialState,
  reducers: {
    setMetadata: (state, action: PayloadAction<IMetadataDataEntity>) => {
      const updateMetadata = state.data.filter((a) => a.key !== action.payload.key);
      updateMetadata.push(action.payload);
      return { ...state, data: updateMetadata };
    },
    setHidden: (state, action: PayloadAction<Array<string>>) => {
      return { ...state, hidden: action.payload, hasHidden: true };
    },
    clearHidden: (state) => {
      return { ...state, hidden: [] };
    },
    clearEntityMetadata: (state, action: PayloadAction<EntityType>) => {
      const updateMetadata = state.data.filter((a) => a.key !== action.payload);
      return { ...state, data: updateMetadata, hasHidden: false };
    },
    clearMetadata: (state) => {
      return { ...state, data: [] };
    },
  },
});
export const metadataReducer = slice.reducer;
export const metadataActions = slice.actions;
