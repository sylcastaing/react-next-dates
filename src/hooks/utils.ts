import { Dispatch, SetStateAction, useMemo, useState } from 'react';

export function useDependentState<S>(
  factory: (prevState?: S) => S,
  inputs: ReadonlyArray<any>,
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(factory());

  useMemo(() => {
    const newState = factory(state);

    if (newState !== state) {
      setState(newState);
    }
  }, inputs);

  return [state, setState];
}

export function useControllableState<S>(
  initialValue: () => S,
  value?: S,
  onChange?: (value: S) => void,
): [S, (value: S) => void] {
  const [state, setState] = useState(initialValue);

  return onChange && value ? [value, onChange] : [state, setState];
}
