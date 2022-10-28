export function indexBy<T>(key: keyof T) {
  return (obj: Record<string, T>, value: T) => ({
    ...obj,
    [value[key] as unknown as string]: value
  })
}
