import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';
import ITransaction from '../interfaces/ITransaction';
import {RootState} from '.';

type TransactionsState = {
  transactions: ITransaction[];
  type: 'category' | 'payee' | 'date';
};

const initialState: TransactionsState = {
  transactions: [],
  type: 'category',
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<ITransaction[]>) => {
      state.transactions = action.payload;
    },
    setType: (state, action: PayloadAction<'category' | 'payee' | 'date'>) => {
      state.type = action.payload;
    },
  },
});

export const {setTransactions, setType} = transactionsSlice.actions;

export const getTransactionsState = createSelector(
  (state: RootState) => state,
  state => state.transactions,
);

export default transactionsSlice.reducer;
