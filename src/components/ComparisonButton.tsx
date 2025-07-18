"use client"
import React from 'react';
import { Typography, Box, Grid2 as Grid, ButtonGroup, Button, Popper, Grow, Paper, ClickAwayListener, MenuItem , MenuList, IconButton } from "@mui/material";
import SideBySideIcon from './SideBySideIcon';
import CollectionsIcon from '@mui/icons-material/Collections';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ImageIcon from '@mui/icons-material/Image';
import CompareIcon from '@mui/icons-material/Compare';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

type ComparisonButtonProps = {
    handleSelection: (selected:number) => void,
}


function StackedIcons() {
  return (
    <Box sx={{ position: 'relative', width: 20, height: 20 }}>
      {/* Bottom Icon */}
      <CompareIcon
        sx={{
          fontSize: 24,
          color: 'primary.main',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {/* Top Icon */}
      <ThreeDRotationIcon
        sx={{
          fontSize: 24,
          color: 'white',
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      />
    </Box>
  );
}

const ComparisonButton = ({handleSelection}:ComparisonButtonProps) => {
    const options = ['SideBySide', 'Slider', 'Difference', 'Slider 3D'];

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
        handleSelection(index);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
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

    return (
        <React.Fragment>
        <ButtonGroup
            color='inherit'
            variant='text'
            ref={anchorRef}
            aria-label="Button group with a nested menu"
            sx={{width:"24px", height: "24px", minWidth:"24px"}}
        >
            <IconButton
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
            color="inherit"
            edge="start"
            >
            {selectedIndex==0 && <SideBySideIcon />}
            {selectedIndex==1 && <CompareIcon />}
            {selectedIndex==2 && <ImageIcon />}
            {selectedIndex==3 && <ThreeDRotationIcon />}
            </IconButton>
        </ButtonGroup>
        <Popper
            sx={{ zIndex: 1 }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
        >
            {({ TransitionProps, placement }) => (
            <Grow
                {...TransitionProps}
                style={{
                transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
            >
                <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                        <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        >
                        {index==0 && <SideBySideIcon/>}
                        {index==1 && <CompareIcon />}
                        {index==2 && <ImageIcon />}
                        {index==3 && <ThreeDRotationIcon />}
                        
                        &nbsp;
                        {option}
                        </MenuItem>
                    ))}
                    </MenuList>
                </ClickAwayListener>
                </Paper>
            </Grow>
            )}
        </Popper>
        </React.Fragment>);
}

export default ComparisonButton;