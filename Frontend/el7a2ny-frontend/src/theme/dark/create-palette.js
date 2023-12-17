import { alpha } from '@mui/material/styles';
import { error, info, neutral, success, warning } from '../colors';
import { getPrimary } from '../utils';

export const createPalette = (config) => {
  const { colorPreset, contrast } = config;

  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[100], 0.38),
      disabledBackground: alpha(neutral[100], 0.12),
      focus: alpha(neutral[100], 0.16),
      hover: alpha(neutral[100], 0.04),
      selected: alpha(neutral[100], 0.12)
    },
    background: {
      default: contrast === 'high' ? '#0B0F19' : '#0E1320',
      paper: neutral[900]
    },
    divider: '#2D3748',
    error,
    info,
    mode: 'dark',
    neutral,
    primary: getPrimary(colorPreset),
    success,
    text: {
      primary: '#EDF2F7',
      secondary: '#A0AEC0',
      disabled: 'rgba(255, 255, 255, 0.48)'
    },
    warning
  };
};
