import React, { FC, ReactNode, useState } from 'react';
import { DatePickerInputProps, NullableDateChangeHandler, ClockSelection, ClockPrecision } from '../../index';
import { useDetectTouch, useOutsideClickHandler } from '../../hooks/utils';
import { constVoid } from '../../utils/function';
import useDateInput from '../../hooks/useDateInput';
import Popper from '../popper/Popper';
import Clock from '../clock/Clock';

export interface TimePickerChildrenProps {
  inputProps: DatePickerInputProps;
  openTimePicker: () => void;
}

export type TimePickerChildren = (props: TimePickerChildrenProps) => ReactNode;

export interface TimePickerProps {
  locale: Locale;
  format?: string;
  date?: Date | null;
  precision?: ClockPrecision;
  vibrate?: boolean;
  placeholder?: string;
  className?: string;
  portalContainer?: Element;
  readonlyOnTouch?: boolean;
  autoOpen?: boolean;
  onChange?: NullableDateChangeHandler;
  children: TimePickerChildren;
}

const TimePicker: FC<TimePickerProps> = ({
  locale,
  format = 'HH:mm',
  date,
  precision = 1,
  vibrate = true,
  placeholder,
  className,
  portalContainer,
  readonlyOnTouch = true,
  autoOpen = true,
  onChange = constVoid,
  children,
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const [selection, setSelection] = useState<ClockSelection>('hours');

  const [inputRef, popperRef] = useOutsideClickHandler<HTMLInputElement, HTMLDivElement>(() => {
    setOpen(false);
    setSelection('hours');
  });

  const openTimePicker = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  const isTouch = useDetectTouch();

  const inputProps = useDateInput({
    locale,
    date,
    format,
    placeholder,
    onChange,
  });

  const handleSelectionEnd = () => setOpen(false);

  const readOnly = readonlyOnTouch && isTouch;

  return (
    <>
      {children({
        inputProps: {
          ...inputProps,
          onFocus: e => {
            inputProps.onFocus(e);

            if (autoOpen) {
              setOpen(true);
            }

            if (readOnly) {
              inputRef.current?.blur();
            }
          },
          ref: inputRef,
          readOnly,
        },
        openTimePicker,
      })}

      <Popper
        ref={popperRef}
        isOpen={isOpen}
        referenceElement={inputRef.current}
        popperElement={popperRef.current}
        portalContainer={portalContainer}
        className="time">
        <Clock
          locale={locale}
          date={date}
          selection={selection}
          precision={precision}
          vibrate={vibrate}
          className={className}
          onChange={onChange}
          onSelectionChange={setSelection}
          onSelectionEnd={handleSelectionEnd}
        />
      </Popper>
    </>
  );
};

export default TimePicker;
