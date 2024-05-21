import React, { PropsWithChildren, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Props = {};

export default function ProjectLayout(props: PropsWithChildren<Props>) {
  const { children } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Item>xs=8</Item>
        </Grid>
        <Grid item xs={10}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
