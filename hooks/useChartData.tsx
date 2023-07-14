import {useMemo} from 'react';
import {getTransactionsState} from '../store/transactionsSlice';
import {
  aggregateDates,
  organizeDates,
  getDatePart,
  getDays,
  getRandomColor,
  sortDates,
} from '../utils';
import {useSelector} from 'react-redux';
import ITransaction from '../interfaces/ITransaction';
import RealmContext from '../RealmContext';
import {format} from 'date-fns';

const useChartData = () => {
  const {useQuery} = RealmContext;
  const {transactions, type} = useSelector(getTransactionsState);
  const realmTransactions = useQuery<ITransaction>('Transaction');

  const isDataFiltered = useMemo(() => {
    console.log('useChartData.tsx 21', {
      transactionsLength: transactions.length,
      realmTransactionsLength: realmTransactions.length,
    });
    return transactions.length !== realmTransactions.length;
  }, [transactions, realmTransactions]);

  const dates = useMemo(
    () => transactions.map(item => item.date),
    [transactions],
  );

  const aggregatedDates = useMemo(() => aggregateDates(dates), [dates]);

  const latestDates = useMemo(
    () => new Set(sortDates(organizeDates(dates))),
    [dates],
  );

  const dateLabels = useMemo(
    () => (isDataFiltered ? aggregatedDates.labels : [...latestDates]),
    [aggregatedDates, latestDates, isDataFiltered],
  );

  console.log('useChartData.tsx 50', {dateLabels, aggregatedDates});

  const calculateGroupedData = () => {
    const groupedT = new Map<string, Set<ITransaction>>();

    for (const item of transactions) {
      const key =
        type === 'category'
          ? item.category.name
          : type === 'payee'
          ? item.payee.name
          : format(item.date, 'd/M/yyyy');

      if (groupedT.has(key)) {
        groupedT.get(key)?.add(item);
      } else {
        groupedT.set(key, new Set([item]));
      }
    }
    return groupedT;
  };

  const iterateGroupedTransactions = (item: string) => {
    let result = 0;
    const itemTransactions = groupedT.get(item);

    if (!itemTransactions) return result;

    for (const item of itemTransactions) {
      result += item.amount;
    }

    return result;
  };

  const iterateLatestDates = (item: string) => {
    let result = 0;
    let numberofDays = 0;

    if (!isDataFiltered) {
      numberofDays = 29;
    } else {
      switch (aggregatedDates.formatLabel) {
        case 'EEEE':
          return iterateGroupedTransactions(item);
        case 'MMMM':
          numberofDays = 29;
          break;
        default:
          numberofDays = 29;
          break;
      }
    }

    const latestDays = getDays(item, numberofDays);

    for (const day of latestDays) {
      const itemResult = iterateGroupedTransactions(day);

      result += itemResult;
    }

    return result;
  };

  const groupedT = useMemo(calculateGroupedData, [transactions, type]);

  const labels = useMemo(
    () => [
      ...new Set(
        type === 'date'
          ? dateLabels
          : transactions.map(item =>
              type === 'category' ? item.category.name : item.payee.name,
            ),
      ),
    ],
    [type, dateLabels],
  );

  const data = useMemo(
    () => ({
      labels:
        type === 'date'
          ? labels.map(item =>
              getDatePart(
                item,
                isDataFiltered ? aggregatedDates.formatLabel : 'MMMM',
              ),
            )
          : labels,
      datasets: [
        {
          data:
            type === 'date'
              ? labels.map(iterateLatestDates)
              : labels.map(iterateGroupedTransactions),
        },
      ],
    }),
    [labels],
  );

  const pieData = useMemo(
    () =>
      labels.map(item => ({
        name:
          type === 'date'
            ? getDatePart(item, aggregatedDates.formatLabel || 'MMMM')
            : item,
        amount:
          type === 'date'
            ? iterateLatestDates(item)
            : iterateGroupedTransactions(item),
        color: getRandomColor(),
        legendFontColor: '#eee',
        legendFontSize: 15,
      })),
    [labels],
  );

  return {labels, data, pieData};
};

export default useChartData;
