import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Alert from '@mui/material/Alert';
import InfoIcon from '@mui/icons-material/Info';

export default function Brokers() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h3">Brokers</Typography>

      <Alert icon={<InfoIcon fontSize="inherit" />} severity="info">
        Broker is a service which manages your securities. Some examples:
        <ul>
          <li>Cryptocurrenncy exchange (Binance, Coinbase)</li>
          <li>Your bank which where you operate with stocks</li>
          <li>
            It might be also a desktop or mobile crypto wallet (Guarda,
            Electrum)
          </li>
        </ul>
      </Alert>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody />
        </Table>
      </TableContainer>
    </Box>
  );
}
