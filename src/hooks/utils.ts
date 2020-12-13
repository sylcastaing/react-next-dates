import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';

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

export function useOutsideClickHandler<
  A extends HTMLElement = HTMLElement,
  B extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement
>(callback: () => void): [MutableRefObject<A | null>, MutableRefObject<B | null>, MutableRefObject<C | null>] {
  const refA = useRef<A | null>(null);
  const refB = useRef<B | null>(null);
  const refC = useRef<C | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        e.target instanceof Element &&
        !refA.current?.contains(e.target) &&
        !refB.current?.contains(e.target) &&
        !refC.current?.contains(e.target)
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return [refA, refB, refC];
}
