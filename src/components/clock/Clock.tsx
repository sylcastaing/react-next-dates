import React, { FC, MouseEventHandler, TouchEventHandler, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { DateChangeHandler } from '../../index';
import { constVoid } from '../../utils/function';
import { getHours, getMinutes, setHours, setMinutes, startOfDay } from 'date-fns';
import { useControllableState, useDetectTouch } from '../../hooks/utils';
import { HOUR_ANGLE, MINUTE_ANGLE } from '../../utils/clock';
import ClockHours from './hours/ClockHours';
import ClockMinutes from './hours/ClockMinutes';

export type TimeSelectionType = 'hours' | 'minutes';

function getSelectionAngle(date: Date, selection: TimeSelectionType): number {
  if (selection === 'hours') {
    return HOUR_ANGLE * (getHours(date) - 3);
  } else {
    return MINUTE_ANGLE * (getMinutes(date) - 15);
  }
}

export interface ClockProps {
  date?: Date | null;
  selection?: TimeSelectionType;
  onChange?: DateChangeHandler;
  onSelectionChange?: (selection: TimeSelectionType) => void;
}

const Clock: FC<ClockProps> = ({ date, selection: receivedSelection, onChange = constVoid, onSelectionChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef<boolean>(false);

  const [containerWidth, setContainerWidth] = useState<number | null>(() => containerRef.current?.clientWidth ?? null);

  const [selection, setSelection] = useControllableState<TimeSelectionType>(
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

  const handleCalcSelected = (currentTarget: HTMLDivElement, pageX: number, pageY: number) => {
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
        onChange(setHours(date ?? startOfDay(new Date()), amHour === 12 ? 0 : amHour + 12));
      } else {
        onChange(setHours(date ?? startOfDay(new Date()), amHour));
      }
    } else {
      const minute = Math.round(positiveAngle / MINUTE_ANGLE + 15);

      const computedMinute = minute >= 60 ? minute - 60 : minute;

      onChange(setMinutes(date ?? startOfDay(new Date()), computedMinute));
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

    handleCalcSelected(currentTarget, pageX, pageY);

    setSelection(selection === 'hours' ? 'minutes' : 'hours');
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
    <div ref={containerRef} className="react-next-dates clock-container">
      <div className="clock-wrapper">
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
                <ClockMinutes date={date} containerRadius={containerWidth / 2} />
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
