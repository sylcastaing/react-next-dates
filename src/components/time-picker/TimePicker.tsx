import React, { FC, ReactNode, useState } from 'react';
import { DatePickerInputProps, NullableDateChangeHandler, TimeSelectionType } from '../../index';
import { useDetectTouch, useOutsideClickHandler } from '../../hooks/utils';
import { constVoid } from '../../utils/function';
import useDateInput from '../../hooks/useDateInput';
import CalendarPopper from '../popper/CalendarPopper';
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
  placeholder?: string;
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
  placeholder,
  portalContainer,
  readonlyOnTouch = true,
  autoOpen = true,
  onChange = constVoid,
  children,
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const [selection, setSelection] = useState<TimeSelectionType>('hours');

  const openTimePicker = () => setOpen(true);

  const [inputRef, popperRef] = useOutsideClickHandler<HTMLInputElement, HTMLDivElement>(() => {
    setOpen(false);
    setSelection('hours');
  });

  const isTouch = useDetectTouch();

  const inputProps = useDateInput({
    locale,
    date,
    format,
    placeholder,
    onChange,
  });

  const handleSelectionChange = (selection: TimeSelectionType) => {
    setSelection(selection);

    if (selection === 'hours') {
      setOpen(false);
    }
  };

  return (
    <>
      {children({
        inputProps: {
          ...inputProps,
          onFocus: () => {
            inputProps?.onFocus();

            if (autoOpen) {
              openTimePicker();
            }

            if (readonlyOnTouch && isTouch) {
              inputRef.current?.blur();
            }
          },
          ref: inputRef,
          readOnly: readonlyOnTouch && isTouch,
        },
        openTimePicker,
      })}

      <CalendarPopper
        ref={popperRef}
        isOpen={isOpen}
        inputElement={inputRef.current}
        popperElement={popperRef.current}
        portalContainer={portalContainer}
        className="time">
        <Clock date={date} selection={selection} onChange={onChange} onSelectionChange={handleSelectionChange} />
      </CalendarPopper>
    </>
  );
};

export default TimePicker;
