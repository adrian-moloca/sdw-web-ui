import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IBookMark, PrevNext } from 'models';
import reject from 'lodash/reject';
import filter from 'lodash/filter';

export interface IBookmarkState {
  items: IBookMark[];
  category: string[];
}
export interface IUserState {
  profile: any;
  session: any;
  bookmarks: IBookmarkState;
}
const initialState: IUserState = {
  profile: undefined,
  session: undefined,
  bookmarks: { items: [], category: [] },
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<any>) => {
      return { ...state, profile: action.payload };
    },
    setSession: (state, action: PayloadAction<any>) => {
      return { ...state, session: action.payload };
    },
    addBookmark: (state, action: PayloadAction<IBookMark>) => {
      return {
        ...state,
        bookmarks: {
          items: state.bookmarks.items.concat(action.payload),
          category: state.bookmarks.category,
        },
      };
    },
    updateBookmark: (state, action: PayloadAction<PrevNext<IBookMark>>) => {
      return {
        ...state,
        bookmarks: {
          items: [
            ...reject(state.bookmarks.items, (x) => {
              const prevState = action.payload.prev;
              return (
                x.link === prevState.link &&
                x.title === prevState.title &&
                x.category === prevState.category
              );
            }),
            action.payload.next,
          ],
          category: state.bookmarks.category,
        },
      };
    },
    removeBookmark: (state, action: PayloadAction<IBookMark>) => {
      return {
        ...state,
        bookmarks: {
          items: [
            ...reject(state.bookmarks.items, (x) => {
              return (
                x.link === action.payload.link &&
                x.title === action.payload.title &&
                x.category === action.payload.category
              );
            }),
          ],
          category: state.bookmarks.category,
        },
      };
    },
    addCategory: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          category: state.bookmarks.category.concat(action.payload),
        },
      };
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        bookmarks: {
          items: filter(state.bookmarks.items, function (o) {
            return o.category !== action.payload;
          }),
          category: filter(state.bookmarks.category, function (o) {
            return o !== action.payload;
          }),
        },
      };
    },
  },
});
export const userReducer = slice.reducer;
export const userActions = slice.actions;
