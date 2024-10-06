import { useContext } from 'react';
import { UnitContext, UnitSystem } from 'src/context/UnitContext';
import convert, { Unit } from "convert";
import { t } from "i18next";

export const useUnit = () => {
  const unitContext = useContext(UnitContext);

  if (!unitContext) {
    throw new Error('useUnitContext must be used within a UnitProvider');
  }

  const lengthUnit = unitContext.unitSystem === 'metric' ? 'mm' : 'in'

  return {
    unitSystem: unitContext.unitSystem,
    setUnitSystem: unitContext.setUnitSystem,
    displayInCurrentUnits: displayInCurrentUnits(unitContext.unitSystem),
    convertToLengthValueInCurrentUnits: convertInCurrentUnits(unitContext.unitSystem),
    roundWithUnits: orElseMissingDataSign(roundWithUnits(lengthUnit), '0'),
    convertCurrentUnitsToMillimeters: (v: number) => convert(v, lengthUnit).to('mm'),
  };
};

const displayInCurrentUnits = (system: UnitSystem) => (sourceUnit: Unit | '%') => {
  const currentUnit = system === 'imperial'? 'in' : 'mm'
  const transformFunction = sourceUnit === 'mm'
   ? (sourceValue: number) => roundWithUnits(currentUnit)(convert(sourceValue, sourceUnit).to(currentUnit))
   : roundWithUnits(sourceUnit);

  return orElseMissingDataSign(transformFunction, '-');
}

const convertInCurrentUnits = (system: UnitSystem) => (sourceUnit: Unit | '%') => {
  const currentUnit = system === 'imperial'? 'in' : 'mm'
  const transformFunction = (sourceUnit === 'mm')
    ?(sourceValue: number) => round(currentUnit)(convert(sourceValue, sourceUnit).to(currentUnit))
    : round(sourceUnit);

  return orElseMissingDataSign(transformFunction, 0);
}

const round = (unit: string) =>
  (value: number) => Number(value.toFixed(unit === 'in' ? 2 : 0));

const roundWithUnits = (unit: string) =>
  (value: number) => value.toFixed(unit === 'in' ? 2 : 0) + t(`${unit}`);

const orElseMissingDataSign = <T extends string | number>(f: (v: number) => T, orElse: T) =>
  (value?: string | number)=>
    value ? f(typeof value === "number" ? value : Number.parseFloat(value)) : orElse;

export const convertToInch = (value: number) => convert(value, 'mm').to('in')
export const convertToMillimeters = (value: number) => convert(value, 'in').to('mm')
