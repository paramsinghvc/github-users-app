'use client';

import { ThemeProvider, createTheme } from '@mui/material';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: { main: '#6750a4' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          padding: '10px 24px',
        },
      },
    },
  },
});

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
