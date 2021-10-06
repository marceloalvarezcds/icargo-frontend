export function getFilterList<T>(list: T[], mapfn: (x: T) => string): string[] {
  return list
        .map(mapfn)
        .filter((x, i, a) => a.indexOf(x) === i)
        .sort((a: string, b: string) => a < b ? -1 : 1);
}
