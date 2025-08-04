import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth.slice';
import { userReducer } from './user.slice';
import { notificationReducer } from './notification.slice';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import { metadataReducer } from './metadata.slice';
import { dataReducer } from './data.slice';
import { useDispatch, useSelector } from 'react-redux';
import { managerReducer } from './manager.slice';
import { dataGridReducer } from './datagrid.slice';
import { drawerReducer } from './drawer.slice';

const KEY = 'redux_sdw_web';

export function loadState() {
  try {
    const serializedState = localStorage.getItem(KEY);
    if (!serializedState) return undefined;
    const currentCopy = JSON.parse(serializedState);
    return omit(currentCopy, ['auth', 'report', 'drawer']);
    // eslint-disable-next-line
  } catch (e) {
    return undefined;
  }
}

export async function saveState(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY, serializedState);
    // eslint-disable-next-line
  } catch (e) {
    // Ignore
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
  metadata: metadataReducer,
  data: dataReducer,
  drawer: drawerReducer,
  notification: notificationReducer,
  user: userReducer,
  manager: managerReducer,
  datagrid: dataGridReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        // Ignore state paths, e.g. state for 'items':
        ignoredPaths: ['metadata.data', 'data.reports', 'manager', 'message'],
      },
      serializableCheck: { ignoredPaths: ['metadata.data', 'data.reports', 'manager'] },
    }),
  preloadedState: loadState(),
});
// here we subscribe to the store changes
store.subscribe(
  // we use debounce to save the state once each 800ms
  // for better performances in case multiple changes occur in a short time
  debounce(() => {
    saveState(store.getState());
  }, 800)
);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
