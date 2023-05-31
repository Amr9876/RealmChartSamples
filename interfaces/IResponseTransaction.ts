interface IResponseTransaction {
  amount: number;
  category: string;
  date: string;
  id: number;
  payee: string;
  type: 'expense' | 'income';
}

export default IResponseTransaction;
