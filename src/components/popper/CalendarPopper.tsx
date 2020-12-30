import React, { forwardRef, ReactNode, useLayoutEffect } from 'react';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

interface CalendarPopperProps {
  isOpen: boolean;
  inputElement: HTMLInputElement | null;
  popperElement: HTMLDivElement | null;
  portalContainer?: Element;
  className?: string;
  children?: ReactNode;
}

const CalendarPopper = forwardRef<HTMLDivElement, CalendarPopperProps>(
  ({ isOpen, inputElement, popperElement, portalContainer, className, children }, ref) => {
    const { styles, attributes, forceUpdate } = usePopper(inputElement, popperElement, {
      placement: 'bottom-start',
      strategy: portalContainer ? 'fixed' : 'absolute',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
        {
          name: 'flip',
        },
      ],
    });

    useLayoutEffect(() => {
      if (isOpen && forceUpdate) {
        forceUpdate();
      }
    }, [isOpen, forceUpdate]);

    const popper = (
      <div
        ref={ref}
        className={classNames('react-next-dates-popper', className)}
        style={{ ...styles.popper, display: isOpen ? 'block' : 'none' }}
        {...attributes.popper}>
        {isOpen ? children : null}
      </div>
    );

    return portalContainer ? createPortal(popper, portalContainer) : popper;
  },
);

export default CalendarPopper;
