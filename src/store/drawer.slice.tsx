import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditionMode, EntityType } from 'models';
interface Item {
  type: EntityType;
  mode: EditionMode;
  item?: any;
}
export interface ProfileState {
  open: boolean;
  mode?: EditionMode;
  item?: any;
}
export interface DrawerState {
  isOpen: boolean;
  type?: EntityType;
  mode?: EditionMode;
  selectedItem?: any;
  profile?: Partial<Record<EntityType, ProfileState>>;
}

const initialState: DrawerState = {
  isOpen: false,
  type: undefined,
  selectedItem: null,
  profile: {
    [EntityType.Competition]: { open: true },
    [EntityType.Person]: { open: true },
    [EntityType.Team]: { open: true },
    [EntityType.Horse]: { open: true },
    [EntityType.Organization]: { open: true },
    [EntityType.Noc]: { open: true },
    [EntityType.GdsDashboard]: { open: true },
  },
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setProfileState: (
      state,
      action: PayloadAction<{ profileType: EntityType; profileState: ProfileState }>
    ) => {
      state.profile ??= {};
      state.profile[action.payload.profileType] = action.payload.profileState;
    },
    toggleProfileOpen: (state, action: PayloadAction<{ profileType: EntityType }>) => {
      state.profile ??= {};

      const current = state.profile[action.payload.profileType];
      const currentIsOpen = current?.open ?? false;

      state.profile[action.payload.profileType] = {
        ...current,
        open: !currentIsOpen,
      };
    },
    openDrawer: (state) => {
      state.isOpen = true;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.selectedItem = null;
      state.type = undefined;
      state.mode = undefined;
    },
    toggleDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSelectedItem: (state, action: PayloadAction<Item>) => {
      state.selectedItem = action.payload.item;
      state.type = action.payload.type;
      state.mode = action.payload.mode;
      state.isOpen = true; // Automatically open drawer when an item is selected
    },
  },
});

export const { openDrawer, closeDrawer, toggleDrawer } = drawerSlice.actions;
export const drawerReducer = drawerSlice.reducer;
export const drawerActions = drawerSlice.actions;
