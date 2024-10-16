// src/components/KPI.js
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

function KPI({ title, value, icon, color }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', backgroundColor: color || '#fff', height: '100%' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            {icon}
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default KPI;
