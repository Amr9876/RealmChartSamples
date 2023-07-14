import {
  parse,
  eachMonthOfInterval,
  eachYearOfInterval,
  max,
  compareAsc,
  subDays,
  subMonths,
  subYears,
  eachDayOfInterval,
  format,
  addDays,
  min,
} from 'date-fns';
import {Dimensions} from 'react-native';
import {AbstractChartConfig} from 'react-native-chart-kit/dist/AbstractChart';

const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

let numbers: number[] = [];

const uniqueNumber = (maxVal: number) => {
  const number = Math.floor(Math.random() * maxVal + 1);
  if (!numbers.includes(number)) {
    numbers.push(number);
    return number;
  } else if (numbers.length - 1 !== maxVal) {
    uniqueNumber(maxVal);
  }
};

function sortDates(dateStrings: string[]): string[] {
  const dates = dateStrings.map(date => parse(date, 'd/M/yyyy', new Date()));

  const formattedDates = dates.sort((a, b) => compareAsc(a, b));

  const result = formattedDates.map(date => format(date, 'd/M/yyyy'));

  return result;
}

function getDatePart(date: string, part: string) {
  const dateParsed = parse(date, 'd/M/yyyy', new Date());

  return format(dateParsed, part);
}

function* getDays(date: string, daysNumber: number) {
  const dateParsed = parse(date, 'd/M/yyyy', new Date());
  let currentDate = dateParsed;
  let count = 0;

  while (count < daysNumber) {
    yield format(currentDate, 'd/M/yyyy');
    currentDate = addDays(currentDate, 1);
    count++;
  }
}

const getDatesBetweenDates = (startDate: Date, endDate: Date) => {
  const dates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return dates.map(item => format(item, 'd/M/yyyy'));
};

function organizeDates(dates: Date[]): string[] {
  if (!dates.length) return [];

  const result = new Set<string>();

  const latestDate = max(dates);

  const latestYear = eachMonthOfInterval({
    start: subDays(latestDate, 360),
    end: latestDate,
  });

  latestYear.forEach(year => result.add(format(year, 'd/M/yyyy')));

  return [...result];
}
function aggregateDates(dates: Date[]) {
  if (!dates.length) return {labels: [], formatLabel: ''};

  let aggregatedDates: Date[];
  let formatLabel = '';

  const start = max(dates);
  const end = min(dates);

  if (dates.length <= 7) {
    aggregatedDates = eachDayOfInterval({
      start,
      end,
    });
    formatLabel = 'EEEE';
  } else if (dates.length <= 41) {
    aggregatedDates = eachDayOfInterval({
      start,
      end,
    });
    formatLabel = 'EEEE';
  } else {
    aggregatedDates = eachMonthOfInterval({
      start,
      end,
    });
    formatLabel = 'MMMM';
  }

  const labels = sortDates(
    aggregatedDates.map(date => format(date, 'd/M/yyyy')),
  );

  return {labels, formatLabel};
}

const checkOverlap = (labels: string[]) => {
  const labelWidth = 50; // width of each label
  const chartWidth = Dimensions.get('window').width * 0.1; // width of chart
  const numLabels = labels.length;
  const totalLabelWidth = numLabels * labelWidth;
  return totalLabelWidth > chartWidth;
};

const chartConfig: AbstractChartConfig = {
  backgroundGradientFrom: '#222',
  backgroundGradientTo: '#222',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  fillShadowGradientFrom: '#0A0',
  fillShadowGradientTo: '#0F0',
  barPercentage: 0.5,
  decimalPlaces: 0,
  strokeWidth: 4,
};

export {
  getRandomColor,
  uniqueNumber,
  sortDates,
  getDatesBetweenDates,
  getDatePart,
  getDays,
  aggregateDates,
  organizeDates,
  checkOverlap,
  chartConfig,
};
