import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {
  Avatar,
  Box,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  SvgIcon,
  Typography
} from '@mui/material';
import { Tip } from '../../../components/tip';

export const ChatSidebarSearch = forwardRef((props, ref) => {
  const {
    isFocused,
    onChange,
    onClickAway = () => { },
    onFocus,
    onSelect,
    query = '',
    results = [],
    ...other
  } = props;

  const showTip = isFocused && !query;
  const showResults = isFocused && query;
  const hasResults = results.length > 0;

  return (
    <Box
        sx={{ p: 2 }}
    >
        <OutlinedInput
          fullWidth
          onChange={onChange}
          onFocus={onFocus}
          placeholder="Search contacts"
          startAdornment={(
            <InputAdornment position="start">
              <SvgIcon>
                <SearchMdIcon />
              </SvgIcon>
            </InputAdornment>
          )}
          value={query}
        />
        {showTip && (
          <Box sx={{ py: 2 }}>
            <Tip message="Enter a contact name" />
          </Box>
        )}
        {showResults && (
          <>
            {hasResults
              ? (
                <Box sx={{ py: 2 }}>
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                  >
                    Contacts
                  </Typography>
                  <List>
                    {results.map((contact) => (
                      <ListItemButton
                        key={contact.id}
                        onClick={() => handleSelect(contact)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={contact.avatar}
                            sx={{
                              height: 32,
                              width: 32
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={contact.name}
                          primaryTypographyProps={{
                            noWrap: true,
                            variant: 'subtitle2'
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              )
              : (
                <Box sx={{ py: 2 }}>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    We couldn&apos;t find any matches for &quot;{query}&quot;. Try checking
                    for typos or using complete words.
                  </Typography>
                </Box>
              )}
          </>
        )}
      </Box>
  );
});

ChatSidebarSearch.propTypes = {
  isFocused: PropTypes.bool,
  onChange: PropTypes.func,
  onClickAway: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array
};
