/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import Api from "../tools/api";

import {
  partial,
  ifElse,
  compose,
  allPass,
  lt,
  gt,
  length,
  __,
  test,
  tap,
  assoc,
  andThen,
  mathMod,
  concat,
  prop,
  otherwise,
} from "ramda";

const api = new Api();

const ltThanTen = lt(__, 10);
const gtThanTwo = gt(__, 2);

const lengthLtThanTen = compose(ltThanTen, length);
const lengthGtThanTwo = compose(gtThanTwo, length);
const isValidNumber = test(/^[0-9]+\.?[0-9]*$/);
const isValidString = allPass([
  lengthLtThanTen,
  lengthGtThanTwo,
  isValidNumber,
]);

const roundNumber = compose(Math.round, Number);

const apiGetNumbersBase = compose(
  api.get("https://api.tech/numbers/base"),
  assoc("number", __, { from: 10, to: 2 })
);

const getLength = andThen(length);

const doSquare = (n) => n ** 2;
const thenDoSquare = andThen(doSquare);

const doMathModByThree = compose(String, mathMod(__, 3));
const thenDoMathModByThree = andThen(doMathModByThree);

const thenAddIdToAnimalUrl = andThen(concat("https://animals.tech/"));
const apiGetAnimalById = andThen(api.get(__, {}));

const getResultFromApiReponse = compose(String, prop("result"));
const thenGetResultFromApiResponse = andThen(getResultFromApiReponse);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const doValidationError = partial(handleError, ["ValidationError"]);

  const tapWriteLog = tap(writeLog);
  const thenTapWriteLog = andThen(tapWriteLog);

  const thenHandleSuccess = andThen(handleSuccess);

  const catchApiError = otherwise(handleError);

  const resultCompose = compose(
    catchApiError,
    thenHandleSuccess,
    thenGetResultFromApiResponse,
    apiGetAnimalById,
    thenAddIdToAnimalUrl,
    thenTapWriteLog,
    thenDoMathModByThree,
    thenTapWriteLog,
    thenDoSquare,
    thenTapWriteLog,
    getLength,
    thenTapWriteLog,
    thenGetResultFromApiResponse,
    apiGetNumbersBase,
    tapWriteLog,
    roundNumber
  );

  const resultComposeIfStringIsValid = ifElse(
    isValidString,
    resultCompose,
    doValidationError
  );

  const startResultCompose = compose(resultComposeIfStringIsValid, tapWriteLog);
  startResultCompose(value);
};

export default processSequence;
