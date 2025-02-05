function sortByDate(data) {
  data.sort((a, b) => {
    if (new Date(a.Date) < new Date(b.Date)) return -1;
    if (new Date(a.Date) > new Date(b.Date)) return 1;
    return 0;
  });
  return data;
}



export {sortByDate}
