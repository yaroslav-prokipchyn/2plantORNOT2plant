import { createContext, FC, PropsWithChildren, useState } from 'react';
import { useDispatch } from "react-redux";
import { formSlice } from 'src/analytics/store';

export type UnitSystem = 'imperial' | 'metric';

type UnitContextProps = {
  unitSystem: UnitSystem,
  setUnitSystem: (unit: UnitSystem) => void
}
export const UnitContext = createContext<UnitContextProps>({
  unitSystem: localStorage.getItem('unitSystem') as UnitSystem || 'metric',
  setUnitSystem: () => { }
})


const UnitProvider: FC<PropsWithChildren> = ({ children }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(localStorage.getItem('unitSystem') as UnitSystem || 'metric');

  const { setUnits } = formSlice.actions;
  const dispatch = useDispatch();
  const setNewUnitSystem = (unitSystem: UnitSystem) => {
    localStorage.setItem('unitSystem', unitSystem);
    setUnitSystem(unitSystem)
    //NOTE: change unit in redux for Analytics
    dispatch(setUnits(unitSystem))
  }

  return (
    <UnitContext.Provider value={{ unitSystem, setUnitSystem: setNewUnitSystem }}>
      {children}
    </UnitContext.Provider>
  );
};

export default UnitProvider;
