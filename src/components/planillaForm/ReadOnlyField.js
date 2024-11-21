import React from 'react';
import { TextField } from '@mui/material';

const ReadOnlyField = ({ label, value }) => {
  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      InputProps={{
        readOnly: true,
      }}
    />
  );
};

export default ReadOnlyField;
