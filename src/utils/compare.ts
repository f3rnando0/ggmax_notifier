import { requestData } from "src/interfaces/data";

export const compare = (obj1: requestData, obj2: requestData) => {
  let result = obj2.data.announcements.filter(item2 => !obj1.data.announcements.some(item1 => item1.id === item2.id));

  return result
};