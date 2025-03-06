//This is a workaround for the issue where the Set intersection function was not recognized in the
//GitHub test pipeline.
export function intersection(set1, set2) {
  const data = [];
  set1.values().forEach(function (item) {
    if (set2.has(item)) {
      data.push(item);
    }
  });
  return data;
}
