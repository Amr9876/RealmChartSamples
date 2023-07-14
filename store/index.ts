import {configureStore, combineReducers} from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';

const reducer = combineReducers({
  transactions: transactionsReducer,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
