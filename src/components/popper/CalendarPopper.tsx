import React, { forwardRef, ReactNode } from 'react';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';

interface CalendarPopperProps {
  isOpen: boolean;
  inputElement: HTMLInputElement | null;
  popperElement: HTMLDivElement | null;
  portalContainer?: Element;
  children?: ReactNode;
}

const CalendarPopper = forwardRef<HTMLDivElement, CalendarPopperProps>(
  ({ isOpen, inputElement, popperElement, portalContainer, children }, ref) => {
    const { styles, attributes } = usePopper(inputElement, popperElement, {
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

    const popper = (
      <div
        ref={ref}
        className="react-next-dates-popper"
        style={{ ...styles.popper, display: isOpen ? 'block' : 'none' }}
        {...attributes.popper}>
        {children}
      </div>
    );

    return portalContainer ? createPortal(popper, portalContainer) : popper;
  },
);

export default CalendarPopper;
