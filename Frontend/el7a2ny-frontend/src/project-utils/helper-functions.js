import axios from "axios";
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

async function GET({ url, setData, setLoading, setShowError, setError }) {
  await axios
    .get(url)
    .then((response) => {
      if (setData) setData(response.data.data);
      if (setLoading) setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setShowError(true);
      setError(error.response.data.message);
    });
}

async function POST({ url, body, updater, setLoading, setShowError, setError }) {
  await axios
    .post(url, body)
    .then(() => {
      if (updater) updater();
      if (setLoading) setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setShowError(true);
      setError(error.response.data.message);
    });
}

async function PATCH({ url, body, updater, setLoading, setShowError, setError }) {
  await axios
    .patch(url, body)
    .then(() => {
      if (updater) updater();
      if (setLoading) setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setShowError(true);
      setError(error.response.data.message);
    });
}

async function DELETE({ url, body, updater, setLoading, setShowError, setError }) {
  console.log("delete body", body);
  await axios
    .delete(url, {data: body})
    .then(() => {
      if (updater) updater();
      if (setLoading) setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setShowError(true);
      setError(error.response.data.message);
    });
}

export { sortByDate, fixFormDate, POST, PATCH, DELETE, GET };
