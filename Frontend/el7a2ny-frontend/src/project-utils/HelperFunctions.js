function sortByDate(data) {
  data.sort((a, b) => {
    if (new Date(a.Date) < new Date(b.Date)) return -1;
    if (new Date(a.Date) > new Date(b.Date)) return 1;
    return 0;
  });
  return data;
}

function fixFormDate(date) {
  if (date.length <= 10) {
    const yyyy = date.slice(0, 4).replace(/[^0-9]/g, "");
    const mmdd = date.slice(4);
    const formattedDate = `${yyyy}${mmdd}`;
    return formattedDate;
  }
}

export { sortByDate, fixFormDate };
