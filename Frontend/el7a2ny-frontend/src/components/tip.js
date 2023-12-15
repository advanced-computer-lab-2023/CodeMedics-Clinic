import PropTypes from 'prop-types';
import Lightbulb04Icon from '@untitled-ui/icons-react/build/esm/Lightbulb04';
import { SvgIcon, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const TipRoot = styled('div')((({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.neutral[800]
    : theme.palette.neutral[100],
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  padding: theme.spacing(1)
})));

export const Tip = (props) => {
  const { message } = props;

  return (
    <TipRoot>
      <SvgIcon
        color="action"
        sx={{ mr: 1 }}
      >
        <Lightbulb04Icon />
      </SvgIcon>
      <Typography
        color="text.secondary"
        sx={{
          alignItems: 'center',
          display: 'flex',
          '& span': {
            fontWeight: 700,
            mr: 0.5
          }
        }}
        variant="caption"
      >
        <span>
          Tip.
        </span>
        {' '}
        {message}
      </Typography>
    </TipRoot>
  );
};

Tip.propTypes = {
  message: PropTypes.string.isRequired
};
