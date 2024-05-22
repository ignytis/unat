import React, { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

type Props = {
  activePage: string;
};

export default function ProjectLayout(props: PropsWithChildren<Props>) {
  const navigate = useNavigate();
  const { activePage, children } = props;

  const onChange = (event: React.SyntheticEvent, newValue: string) => {
    if (!['dashboard', 'brokers'].includes(newValue)) {
      return;
    }

    navigate(`/project/${newValue}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs onChange={onChange} value={activePage}>
            <Tab label="Dashboard" value="dashboard" />
            <Tab label="Brokers" value="brokers" />
            <Tab label="Securities" disabled value="securities" />
            <Tab label="Accounts" disabled value="accounts" />
            <Tab label="Operations" disabled value="operations" />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
