/**
 * Returns true if the timestamp is after the current moment, and returns false otherwise.
 * @param timestamp timestamp in seconds
 */
export function isAfterNow(timestamp: number): boolean {
  return timestamp * 1000 > new Date().getTime();
}
