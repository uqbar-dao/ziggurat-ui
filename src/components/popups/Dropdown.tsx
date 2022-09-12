import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Col from '../spacing/Col';

import './Dropdown.scss';

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | React.ReactNode;
  open: boolean;
  unstyled?: boolean;
  toggleOpen: () => void;
}

const Dropdown = ({
  children,
  value,
  open,
  unstyled = false,
  toggleOpen,
  className = '',
  ...props
}: DropdownProps) => {
  return (
    <div {...props} className={`dropdown ${className} ${unstyled ? 'unstyled' : ''}`}>
      {open && <div className='close-background' onClick={toggleOpen} />}
      <div className={`selector ${open ? 'open' : ''}`} onClick={toggleOpen}>
        {value}
        <FaChevronDown style={{marginLeft: '8px'}} />
      </div>
      {open && (
        <div className='content-border'>
          <Col className='dropdown-content'>{children}</Col>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
