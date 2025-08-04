import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MessageType, IMessageProps } from 'models';
import dayjs from 'dayjs';

export interface IMessageState {
  notifications: IMessageProps[];
  latestNotification: IMessageProps | undefined;
}
interface IMessageAlert {
  title: string;
  type: MessageType;
}

const initialState: IMessageState = {
  notifications: [],
  latestNotification: undefined,
};

const slice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<IMessageProps>) => {
      const newNotification: any = {
        ...action.payload,
        dismiss: false,
      };
      // Remove existing notification with the same ID
      state.notifications = state.notifications.filter((n) => n.id !== newNotification.id);
      // Add the new notification
      state.notifications.push(newNotification);
      // Limit to latest 50
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(-50);
      }
      // Set latestNotification unless type is 4
      state.latestNotification = newNotification.type === 4 ? undefined : newNotification;
    },
    addAlert: (state, action: PayloadAction<IMessageAlert>) => {
      const newNotification: IMessageProps = {
        id: action.payload.title,
        title: action.payload.title,
        type: action.payload.type,
        dateOccurred: dayjs().format(),
        progress: 0,
        status:
          action.payload.type == 1
            ? 1
            : action.payload.type == 3
              ? 3
              : action.payload.type == 2
                ? 2
                : action.payload.type == 4
                  ? 0
                  : 7,
      };
      // Add the new notification
      state.notifications.push(newNotification);
      // Limit to latest 50
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(-50);
      }
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      const update_notifications = state.notifications.filter((a) => a.id !== action.payload);
      //const update_result = sortDesc(update_notifications, 'dateOccurred');
      return { ...state, notifications: update_notifications };
    },
    dismissLatest: (state) => {
      return { ...state, latestNotification: undefined };
    },
    purgeNotification: (state) => {
      return { ...state, notifications: [], latestNotification: undefined };
    },
  },
});
export const notificationReducer = slice.reducer;
export const notificationActions = slice.actions;
