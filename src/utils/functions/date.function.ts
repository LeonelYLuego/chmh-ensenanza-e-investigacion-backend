const months = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export function lastDayOfTheMonth(date: Date): number {
  const year = date.getFullYear(),
    month = date.getMonth();
  switch (month + 1) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28;
    default:
      return NaN;
  }
}

export function dateToString(date: Date): string {
  return `${date.getDate()} de ${
    months[date.getMonth()]
  } de ${date.getFullYear()}`;
}

export function getPeriod(period: number, year: number): string {
  switch (period) {
    case 0:
      return `1° de marzo al 31 de junio de ${year}`;
    case 1:
      return `1° de julio al 31 de octubre de ${year}`;
    case 2:
      const lastDay =
        (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28;
      return `1° de noviembre de ${year} al ${lastDay} de febrero de ${
        year + 1
      }`;
    default:
      return '';
  }
}

export function getInterval(initialDate: Date, finalDate: Date): string {
  return `1° de ${
    months[initialDate.getMonth()]
  } de ${initialDate.getFullYear()} al ${lastDayOfTheMonth(finalDate)} de ${
    months[finalDate.getMonth()]
  } de ${finalDate.getFullYear()}`;
}
