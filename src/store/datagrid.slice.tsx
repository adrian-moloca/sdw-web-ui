import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DataGridState {
  profiles: any[];
}

const initialState: DataGridState = {
  profiles: [],
};

const slice = createSlice({
  name: 'dataGrid',
  initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<any[]>) => {
      state.profiles = action.payload; // Update the selection model
    },
  },
});

export const dataGridReducer = slice.reducer;
export const dataGridActions = slice.actions;
