export function getFilterList<T>(
  list: T[],
  mapfn: (x: T) => string | null | undefined
): string[] {
  const filteredList = list
    .map(mapfn)
    .filter((x, i, a) => !!x && a.indexOf(x) === i) as string[];
  return filteredList.sort((a: string, b: string) => (a < b ? -1 : 1));
}
