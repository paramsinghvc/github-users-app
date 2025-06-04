'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import { ChevronDown } from 'react-feather';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

export type SortOption = 'Username' | 'Ranking' | 'Created Date';
const options: SortOption[] = ['Username', 'Ranking', 'Created Date'];

type SortButtonProps = {
  className?: string;
  onSortChange: (sortBy: SortOption) => void;
};

export default function SortButton({
  className,
  onSortChange,
}: SortButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleMenuItemClick = (
    _: React.MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    setSelectedIndex(index);
    onSortChange(options[index]);
    setOpen(false);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const isSelectionMade = selectedIndex > -1 && selectedIndex < options.length;

  return (
    <>
      <Button
        variant="outlined"
        className={className}
        ref={anchorRef}
        onClick={handleToggle}
        endIcon={<ChevronDown size={16} />}
      >
        <span className="text-xs">
          {isSelectionMade ? `Sorted by ${options[selectedIndex]}` : 'Sort by'}
        </span>
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        disablePortal
        sx={{ zIndex: 1 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'left top' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem id="sort-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      <span className="text-xs">{option}</span>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
