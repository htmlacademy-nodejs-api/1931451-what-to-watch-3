export const generateRandomValue = (min:number, max: number, numAfterDigit = 0): number =>
  +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);

export const getRandomItems = <T = string>(items: T[]): T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export const getRandomItem = <T = string>(items: T[]): T =>
  items[generateRandomValue(0, items.length - 1)];
