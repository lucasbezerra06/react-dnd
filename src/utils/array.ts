import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";

export function removeAtIndex<T>(array: T[], index: number) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function insertAtIndex<T>(array: T[], index: number, item: T) {
  return [...array.slice(0, index), item, ...array.slice(index)];
}
export function arrayMove<T>(array: T[], oldIndex: number, newIndex: number) {
  // console.log(oldIndex, newIndex);
  // console.log(dndKitArrayMove(array, oldIndex, newIndex));
  return dndKitArrayMove(array, oldIndex, newIndex);
}
// export function arrayMove<T>(array: T[], oldIndex: number, newIndex: number) {
//   const item = array[newIndex];
//   const newArray = array.filter((i, idx) => idx !== newIndex);
//   newArray.splice(oldIndex, 0, item);
//   console.log([...newArray])
//   return [...newArray];
// }
