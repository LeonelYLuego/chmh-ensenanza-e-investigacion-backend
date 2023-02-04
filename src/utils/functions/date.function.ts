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

/** Gets the last day of a month as a number */
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

/** Converts a Date object to string as a `1 de enero de 2023` */
export function dateToString(date: Date): string {
  return `${date.getDate()} de ${
    months[date.getMonth()]
  } de ${date.getFullYear()}`;
}

/** Gets a period as a string like `1° de marzo al 31 de junio de 2023` */
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

/** Gets a interval as a string like `1° de enero de 2023 al 31 de enero de 2023` */
export function getInterval(initialDate: Date, finalDate: Date): string {
  return `1° de ${
    months[initialDate.getMonth()]
  } de ${initialDate.getFullYear()} al ${lastDayOfTheMonth(finalDate)} de ${
    months[finalDate.getMonth()]
  } de ${finalDate.getFullYear()}`;
}
