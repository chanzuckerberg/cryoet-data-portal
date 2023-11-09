/*
from https://stackoverflow.com/a/47914631
*/

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}
