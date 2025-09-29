
import { Input } from '@material-tailwind/react';
import React from 'react';

interface MaskedInputProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  mask: string;
  disabled?: boolean
}

const InputMask: React.FC<MaskedInputProps> = ({ value, onChange, label, mask, disabled }) => {

  const applyMask = (value: string, mask: string): string => {
    const cleanedValue = value.replace(/\D/g, '');
    let maskedValue = '';
    let j = 0;

    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === '9') {
        if (j < cleanedValue.length) {
          maskedValue += cleanedValue[j++];
        } else {
          break;
        }
      } else {
        maskedValue += mask[i];
      }
    }

    return maskedValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanedValue = inputValue.replace(/\D/g, '');
    const maskedValue = applyMask(cleanedValue, mask);
    onChange(maskedValue);
  };

  return (
    <div>
      <Input disabled={disabled}
        type="text"
        value={value}
        onChange={handleChange}
        label={label}
        crossOrigin={undefined} />
    </div>
  );
};

export default InputMask;
