import React, { FC, MouseEventHandler, TouchEventHandler, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { DateChangeHandler } from '../../index';
import { constVoid } from '../../utils/function';
import { getHours, getMinutes, setHours, setMinutes, startOfDay } from 'date-fns';
import { useDetectTouch } from '../../hooks/utils';

const ITEM_WIDTH = 24;

const HOUR_ANGLE = 30; // 360 / 12
const MINUTE_ANGLE = 6; // 360 / 50

type SelectionType = 'hours' | 'minutes';

function getItemPosition(index: number, containerRadius: number, radius: number): { top: number; left: number } {
  return {
    top: radius * Math.sin(HOUR_ANGLE * (index - 2) * (Math.PI / 180)) + containerRadius - ITEM_WIDTH / 2,
    left: radius * Math.cos(HOUR_ANGLE * (index - 2) * (Math.PI / 180)) + containerRadius - ITEM_WIDTH / 2,
  };
}

function getSelectionAngle(date: Date, selection: SelectionType): number {
  if (selection === 'hours') {
    return HOUR_ANGLE * (getHours(date) - 3);
  } else {
    return MINUTE_ANGLE * (getMinutes(date) - 15);
  }
}

function format2Digits(val: number): string {
  return `${val < 10 ? '0' : ''}${val}`;
}

interface ClockProps {
  date?: Date | null;
  onChange?: DateChangeHandler;
}

const Clock: FC<ClockProps> = ({ date, onChange = constVoid }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef<boolean>(false);

  const [containerWidth, setContainerWidth] = useState<number | null>(() => containerRef.current?.clientWidth ?? null);

  const [selection, setSelection] = useState<SelectionType>('hours');

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

  const handleSelectEnd = () => {
    isDragging.current = false;

    setSelection(old => (old === 'hours' ? 'minutes' : 'hours'));
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = e => handleSelectStart(e.currentTarget, e.pageX, e.pageY);
  const handleMouseMove: MouseEventHandler<HTMLDivElement> = e => handleSelecting(e.currentTarget, e.pageX, e.pageY);

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = e => {
    if (e.changedTouches[0]) {
      handleSelectStart(e.currentTarget, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }
  };

  const handleToucheEnd: TouchEventHandler<HTMLDivElement> = e => {
    if (e.changedTouches[0]) {
      handleSelecting(e.currentTarget, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }
  };

  return (
    <div ref={containerRef} className="react-next-dates clock-container">
      <div className="clock-wrapper">
        <div
          className="clock-content"
          onMouseDown={isTouch ? undefined : handleMouseDown}
          onMouseMove={isTouch ? undefined : handleMouseMove}
          onMouseUp={isTouch ? undefined : handleSelectEnd}
          onTouchStart={isTouch ? handleTouchStart : undefined}
          onTouchMove={isTouch ? handleToucheEnd : undefined}
          onTouchEnd={isTouch ? handleSelectEnd : undefined}>
          {containerWidth && (
            <>
              {Array(12)
                .fill('')
                .map((_, i) => (
                  <span key={i} style={getItemPosition(i, containerWidth / 2, containerWidth / 2 - 20)}>
                    {selection === 'hours' ? i + 1 : format2Digits(i === 11 ? 0 : (i + 1) * 5)}
                  </span>
                ))}

              {selection === 'hours'
                ? Array(12)
                    .fill('')
                    .map((_, i) => (
                      <span key={i} style={getItemPosition(i, containerWidth / 2, containerWidth / 4)}>
                        {i + 13 === 24 ? '00' : i + 13}
                      </span>
                    ))
                : null}

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
          )}
        </div>
      </div>
    </div>
  );
};

export default Clock;
