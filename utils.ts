import {parse} from 'date-fns';

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
  const dates = dateStrings.map(dateString =>
    parse(dateString, 'd/M/yyyy', new Date()),
  );
  const formattedDates = dates
    .sort((a, b) => a.getTime() - b.getTime())
    .map(date =>
      date
        .toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        })
        .replace(/\//g, '-')
        .replace(/-/g, '/'),
    );
  return formattedDates;
}

export {getRandomColor, uniqueNumber, sortDates};
