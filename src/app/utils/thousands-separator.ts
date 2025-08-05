const regex = /\./g;

export const errorMessage =
  'El input con la directiva appInputThousandsSeparator debe ser tipo texto y no tipo numérico';

export const zeroCommaTerminatedRegex = /^(\-|\+)$|^([\-|\.|\d]*\,0*)$/;

export const numberWithCommas = (x: string | number | undefined): string => {
  if (x === undefined || x === null) {
    return '';
  }
  let n;
  if (typeof x === 'number') {
    n = x.toString().replace(regex, ',');
  } else {
    n = x;
  }
  const splited = n.split(',');
  let num = splited[0].replace(regex, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (splited.length > 1) {
    num += `,${splited[1]}`;
  }
  return num;
};

export const numberWith2Commas = (x: string | number | undefined): string => {
  if (x === undefined || x === null) {
    return '';
  }
  let n;
  if (typeof x === 'number') {
    n = x.toString().replace(regex, ',');
  } else {
    n = x;
  }
  const splited = n.split('.');
  let num = splited[0].replace(regex, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (splited.length > 1) {
    num += `,${splited[1].padEnd(2, "0").substring(0,2)}`;
  } else {
    num += `,00`;
  }
  return num;
};

export const numberWithoutCommas = (
  x: string | number | undefined
): number | undefined => {
  if (typeof x === 'number') {
    return x;
  }
  if (x !== undefined && x !== null && x !== '') {
    return Number(x.replace(regex, '').replace(',', '.'));
  }
  return undefined;
};

export const preventTypingNonNumericCharacters = (
  event: KeyboardEvent
): void => {
  if (
    !event.ctrlKey && // -> Ctrl press
    // tslint:disable-next-line: deprecation
    event.which !== 8 && // -> back
    // tslint:disable-next-line: deprecation
    event.which !== 9 && // -> Tab
    // tslint:disable-next-line: deprecation
    event.which !== 35 && // -> Fin
    // tslint:disable-next-line: deprecation
    event.which !== 36 && // -> Inicio
    // tslint:disable-next-line: deprecation
    event.which !== 37 && // -> arrow left
    // tslint:disable-next-line: deprecation
    event.which !== 39 && // -> arrow right
    // tslint:disable-next-line: deprecation
    event.which !== 46 && // -> Supr
    // tslint:disable-next-line: deprecation
    event.which !== 46 && // -> Insert
    // tslint:disable-next-line: deprecation
    (event.which < 48 || event.which > 57) && // -> digits
    // tslint:disable-next-line: deprecation
    (event.which < 96 || event.which > 105) && // -> digits
    // tslint:disable-next-line: deprecation
    event.which !== 109 &&
    event.which !== 189 && // -> -
    // tslint:disable-next-line: deprecation
    event.which !== 144 && // -> Bloq Num
    // tslint:disable-next-line: deprecation
    event.which !== 188 // -> ,
  ) {
    event.preventDefault();
    return;
  }
};
