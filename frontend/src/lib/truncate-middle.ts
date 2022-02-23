/**
 * Truncates a string in the middle, by taking the first 6 characters
 * and the last 4 characters and replacing the middle with an ellipsis
 */
export function truncateMiddle(str: string) {
  return str.slice(0, 6) + '\u2026' + str.slice(str.length - 4, str.length)
}
