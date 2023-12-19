import { createTheme as createMuiTheme } from '@mui/material';
import { createTypography } from './create-typography';
import { createOptions } from './light/create-options';
import { darkOptions} from './dark/create-options';

export function createTheme({mode}) {
  const option = mode === 'dark' ? darkOptions() : createOptions();
  
  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440
      }
    },
    palette: option.palette,
    components: option.components,
    shadows: option.shadows,
    createTypography,
    shape: {
      borderRadius: 8
    },
  });
}
