import React, { FC, MouseEventHandler, TouchEventHandler, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { DateChangeHandler } from '../../index';
import { constVoid } from '../../utils/function';
import { getHours, getMinutes, isEqual, setHours, setMinutes, startOfDay } from 'date-fns';
import { useControllableState, useDetectTouch } from '../../hooks/utils';
import { HOUR_ANGLE, MINUTE_ANGLE } from '../../utils/clock';
import ClockHours from './hours/ClockHours';
import ClockMinutes from './hours/ClockMinutes';
import ClockNavigation from './navigation/ClockNavigation';

export type ClockSelection = 'hours' | 'minutes';
export type ClockPrecision = 1 | 10 | 15 | 20 | 30 | 60;

function getSelectionAngle(date: Date, selection: ClockSelection): number {
  if (selection === 'hours') {
    return HOUR_ANGLE * (getHours(date) - 3);
  } else {
    return MINUTE_ANGLE * (getMinutes(date) - 15);
  }
}

export interface ClockProps {
  locale: Locale;
  date?: Date | null;
  selection?: ClockSelection;
  precision?: ClockPrecision;
  onChange?: DateChangeHandler;
  onSelectionChange?: (selection: ClockSelection) => void;
  onSelectionEnd?: () => void;
}

const Clock: FC<ClockProps> = ({
  locale,
  date: receivedDate,
  selection: receivedSelection,
  precision = 1,
  onChange = constVoid,
  onSelectionChange,
  onSelectionEnd = constVoid,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef<boolean>(false);

  const [date, setDate] = useState<Date | null>(() => receivedDate ?? null);

  const [containerWidth, setContainerWidth] = useState<number | null>(() => containerRef.current?.clientWidth ?? null);

  const [selection, setSelection] = useControllableState<ClockSelection>(
    () => 'hours',
    receivedSelection,
    onSelectionChange,
  );

  const isTouch = useDetectTouch();

  useEffect(() => {
    const getContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', getContainerWidth);

    getContainerWidth();

    return () => {
      window.removeEventListener('resize', getContainerWidth);
    };
  }, []);

  useEffect(() => {
    setDate(receivedDate ?? null);
  }, [receivedDate]);

  const handleDateChange = (date: Date, fireChange: boolean) => {
    setDate(d => {
      if (d === null || !isEqual(d, date)) {
        return date;
      }

      return d;
    });

    if (fireChange && (receivedDate == null || !isEqual(receivedDate, date))) {
      onChange(date);
    }
  };

  const handleCalcSelected = (
    currentTarget: HTMLDivElement,
    pageX: number,
    pageY: number,
    fireChange: boolean = false,
  ) => {
    const rect = currentTarget.getBoundingClientRect();

    const containerRadius = rect.width / 2;

    const x = pageX - rect.left + window.screenX - containerRadius;
    const y = pageY - rect.top + window.screenY - containerRadius;

    const angle = (Math.atan2(y, x) * 180.0) / Math.PI;

    const positiveAngle = angle < 0 ? 360 + angle : angle;

    if (selection === 'hours') {
      const hour = Math.round(positiveAngle / HOUR_ANGLE + 3);

      const pmRadius = containerRadius / 2 + 12;

      const amHour = hour > 12 ? hour - 12 : hour;

      if (Math.abs(x) < pmRadius && Math.abs(y) < pmRadius) {
        handleDateChange(setHours(date ?? startOfDay(new Date()), amHour === 12 ? 0 : amHour + 12), fireChange);
      } else {
        handleDateChange(setHours(date ?? startOfDay(new Date()), amHour), fireChange);
      }
    } else {
      const minute = Math.round(positiveAngle / MINUTE_ANGLE + 15);

      const computedMinute = minute >= 60 ? minute - 60 : minute;

      const roundedWithPrecision = (Math.round(computedMinute / precision) * precision) % 60;

      handleDateChange(setMinutes(date ?? startOfDay(new Date()), roundedWithPrecision), fireChange);
    }
  };

  const handleSelectStart = (currentTarget: HTMLDivElement, pageX: number, pageY: number) => {
    handleCalcSelected(currentTarget, pageX, pageY);
    isDragging.current = true;
  };

  const handleSelecting = (currentTarget: HTMLDivElement, pageX: number, pageY: number) => {
    if (isDragging.current) {
      handleCalcSelected(currentTarget, pageX, pageY);
    }
  };

  const handleSelectEnd = (currentTarget: HTMLDivElement, pageX: number, pageY: number) => {
    isDragging.current = false;

    handleCalcSelected(currentTarget, pageX, pageY, true);

    const newSelection = selection === 'hours' && precision !== 60 ? 'minutes' : 'hours';

    setSelection(newSelection);

    if (newSelection === 'hours') {
      onSelectionEnd();
    }
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = e => handleSelectStart(e.currentTarget, e.pageX, e.pageY);
  const handleMouseMove: MouseEventHandler<HTMLDivElement> = e => handleSelecting(e.currentTarget, e.pageX, e.pageY);
  const handleMouseUp: MouseEventHandler<HTMLDivElement> = e => handleSelectEnd(e.currentTarget, e.pageX, e.pageY);

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = e => {
    if (e.changedTouches[0]) {
      handleSelectStart(e.currentTarget, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = e => {
    if (e.changedTouches[0]) {
      isDragging.current = true;
      handleSelecting(e.currentTarget, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }
  };

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = e => {
    if (e.changedTouches[0]) {
      handleSelectEnd(e.currentTarget, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }
  };

  return (
    <div className="react-next-dates clock-container">
      <ClockNavigation locale={locale} date={date} selection={selection} onSelectionChange={setSelection} />

      <div ref={containerRef} className="clock-wrapper">
        <div
          className="clock-content"
          onMouseDown={isTouch ? undefined : handleMouseDown}
          onMouseMove={isTouch ? undefined : handleMouseMove}
          onMouseUp={isTouch ? undefined : handleMouseUp}
          onTouchStart={isTouch ? handleTouchStart : undefined}
          onTouchMove={isTouch ? handleTouchMove : undefined}
          onTouchEnd={isTouch ? handleTouchEnd : undefined}>
          {containerWidth !== null ? (
            <>
              {selection === 'hours' ? (
                <ClockHours date={date} containerRadius={containerWidth / 2} />
              ) : (
                <ClockMinutes date={date} containerRadius={containerWidth / 2} precision={precision} />
              )}

              {date != null ? (
                <div
                  className={classNames('clock-selection', {
                    pm: selection === 'hours' && (date.getHours() === 0 || date.getHours() > 12),
                  })}
                  style={{
                    transform: `rotate(${getSelectionAngle(date, selection)}deg)`,
                  }}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Clock;
