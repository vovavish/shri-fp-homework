/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  allPass,
  equals,
  compose,
  prop,
  values,
  filter,
  length,
  gte,
  __,
  countBy,
  identity,
  not,
  keys,
  anyPass,
} from "ramda";

import { SHAPES, COLORS } from "../constants";

const equalsOne = equals(1);
const equalsTwo = equals(2);
const equalsFour = equals(4);

const getPropTriangle = prop(SHAPES.TRIANGLE);
const getPropSquare = prop(SHAPES.SQUARE);
const getPropCircle = prop(SHAPES.CIRCLE);
const getPropStar = prop(SHAPES.STAR);

const isRed = equals(COLORS.RED);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);
const isGreen = equals(COLORS.GREEN);
const isWhite = equals(COLORS.WHITE);

const isNotWhite = compose(not, isWhite);

const isRedStar = compose(isRed, getPropStar);

const isGreenSquare = compose(isGreen, getPropSquare);
const isGreenTriangle = compose(isGreen, getPropTriangle);

const isWhiteTriangle = compose(isWhite, getPropTriangle);
const isWhiteCircle = compose(isWhite, getPropCircle);

const isBlueCircle = compose(isBlue, getPropCircle);

const isOrengeSquare = compose(isOrange, getPropSquare);

const getOnlyGreen = filter(isGreen);
const getOnlyBlue = filter(isBlue);
const getOnlyRed = filter(isRed);
const getOnlyOrange = filter(isOrange);

const getNotWhite = filter(isNotWhite);

const countGreenShapes = compose(length, getOnlyGreen, values);
const countBlueShapes = compose(length, getOnlyBlue, values);
const countRedhapes = compose(length, getOnlyRed, values);
const countOrangeShapes = compose(length, getOnlyOrange, values);

const gteThanTwo = gte(__, 2);
const gteThanThree = gte(__, 3);

const blueShapesEqRedShapes = ([blue, red]) => blue === red;
const getBlueAndRedShapes = (shapes) => [
  countBlueShapes(shapes),
  countRedhapes(shapes),
];

const countColors = compose(countBy(identity), values);

const filterColorsGteThanThree = filter(gteThanThree);
const getColorsGteThanThree = compose(filterColorsGteThanThree, countColors);

const isTwoGreenShapes = compose(equalsTwo, countGreenShapes);
const isOneRedShape = compose(equalsOne, countRedhapes);

const isRedOrWhiteStar = anyPass([isRed, isWhite]);

const isNotWhiteTriangle = compose(isNotWhite, getPropTriangle);
const isNotWhiteSquare = compose(isNotWhite, getPropSquare);
const isTriangleEqualsSquare = ({ triangle, square }) => triangle === square;

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isRedStar,
  isGreenSquare,
  isWhiteCircle,
  isWhiteTriangle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(gteThanTwo, countGreenShapes);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(
  blueShapesEqRedShapes,
  getBlueAndRedShapes
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isBlueCircle,
  isRedStar,
  isOrengeSquare,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
  equalsOne,
  length,
  getNotWhite,
  keys,
  getColorsGteThanThree
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isTwoGreenShapes,
  isGreenTriangle,
  isOneRedShape,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(equalsFour, countOrangeShapes);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(not, isRedOrWhiteStar, getPropStar);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(equalsFour, countGreenShapes);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  isNotWhiteSquare,
  isNotWhiteTriangle,
  isTriangleEqualsSquare,
]);
