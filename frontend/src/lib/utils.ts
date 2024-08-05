
import { ClassNameValue, twMerge } from 'tailwind-merge'

export function cn(className: string, ...other: ClassNameValue[]) {
  return twMerge(className, other);
}

export async function sleep(ms: number) {
  return await new Promise<void>(resolve => setTimeout(resolve, ms));
}


export function generateRandomString(len: number) {
  let letters = 'a e i o u 1 2 3 4 5 6 7 8 9 0'.split(' ');
  let randomName = '';

  const length = letters.length - 1;

  for (let i = 0; i <= len; i++) {
    const idx = Math.round(Math.random() * length);
    randomName += letters[idx];
  }

  return randomName;
}


export const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value);
}