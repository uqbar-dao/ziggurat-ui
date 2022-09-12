import React from 'react'
import { FaCheckSquare, FaRegSquare, FaSquare } from 'react-icons/fa';
import Row from '../../components/spacing/Row';
import Text from '../../components/text/Text'

import './Checkbox.scss'

interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  isSelected: boolean
  onCheckboxChange: () => void
}

const Checkbox: React.FC<CheckboxProps> = ({ label, isSelected, onCheckboxChange }) => (
  <Row className='checkbox'>
    <label className={isSelected ? 'checked' : 'unchecked'}>
      <Row>
        {isSelected ? <FaCheckSquare className='icon checked' />
        : <FaRegSquare className='icon unchecked' />}
        <input
          type='checkbox'
          name={label}
          checked={isSelected}
          onChange={onCheckboxChange}
        />
        <Text ml1>
          {label}
        </Text>
      </Row>
    </label>
  </Row>
);

export default Checkbox;

