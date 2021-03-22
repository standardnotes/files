export type DateString = string

export const daysToSeconds = (n: number): number => n * 24 * 60 * 60
export const hoursToSeconds = (n: number): number => n * 60 * 60
export const minutesToSeconds = (n: number): number => n * 60
