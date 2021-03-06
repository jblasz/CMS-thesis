export function formatDate(date: Date, withHourMinute = false) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: '2-digit',
    ...(withHourMinute ? {
      hour: '2-digit',
      minute: '2-digit',
    } : {}),
  }).format(new Date(date));
}

export function generateList(count: number, stackAdditionalRandom = 0) {
  const len = count + Math.floor(Math.random() * stackAdditionalRandom);
  const ret = [];
  for (let i = 0; i < len; i++) {
    ret.push(i);
  }
  return ret;
}

export function shuffleList(l: unknown[]) {
  const list = [...l];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function stringifyDatePair(dateFrom: Date, dateTo: Date) {
  if (dateFrom.getUTCFullYear() === dateTo.getUTCFullYear()
    && dateFrom.getUTCMonth() === dateTo.getUTCMonth()
    && dateFrom.getUTCDate() === dateTo.getUTCDate()) {
    return `
        ${formatDate(dateFrom)}, 
        ${formatDate(dateFrom, true).split(', ')[1]}-${formatDate(dateTo, true).split(', ')[1]}
      `;
  }
  return `${formatDate(dateFrom)}, ${formatDate(dateTo)}`;
}
