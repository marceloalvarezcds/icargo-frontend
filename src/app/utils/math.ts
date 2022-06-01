export function roundString(val: string): number {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

export function round(val: number): number {
  return Math.round(val * 100) / 100;
}

export function subtract(a: number, b: number): number {
  return Math.round((a - b) * 100) / 100;
}
