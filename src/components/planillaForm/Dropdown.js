import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Dropdown = ({ label, options, value, onChange, multiple = false }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(multiple ? e.target.value : e.target.value)}
        multiple={multiple}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
