function createRequestID() {
  let date = new Date();
  function pad2(n: any) {
    // always returns a string
    return (n < 10 ? '0' : '') + n;
  }
  return (
    date.getFullYear() +
    pad2(date.getMonth() + 1) +
    pad2(date.getDate()) +
    pad2(date.getHours()) +
    pad2(date.getMinutes()) +
    pad2(date.getSeconds())
  );
}

export default createRequestID;
