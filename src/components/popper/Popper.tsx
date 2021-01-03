import React, { forwardRef, ReactNode, useLayoutEffect } from 'react';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

export interface PopperProps {
  isOpen: boolean;
  referenceElement: HTMLElement | null;
  popperElement: HTMLElement | null;
  portalContainer?: Element;
  offset?: [number, number];
  className?: string;
  children?: ReactNode;
}

const Popper = forwardRef<HTMLDivElement, PopperProps>(
  ({ isOpen, referenceElement, popperElement, portalContainer, offset = [0, 5], className, children }, ref) => {
    const { styles, attributes, forceUpdate } = usePopper(referenceElement, popperElement, {
      placement: 'bottom-start',
      strategy: portalContainer ? 'fixed' : 'absolute',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset,
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
        className={classNames('react-next-dates', 'popper', className)}
        style={{ ...styles.popper, display: isOpen ? 'block' : 'none' }}
        {...attributes.popper}>
        {isOpen ? children : null}
      </div>
    );

    return portalContainer ? createPortal(popper, portalContainer) : popper;
  },
);

export default Popper;
