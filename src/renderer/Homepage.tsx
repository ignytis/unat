import Box from '@mui/system/Box';

import { Link, useNavigate } from 'react-router-dom';

import { useEffect } from 'react';

function Homepage() {
  const navigate = useNavigate();
  useEffect(() => {
    window.electron.ipcRenderer.on('app:project:loaded', () => {
      navigate('/project/dashboard');
    });
  });

  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      No active project is loaded. Please use the <i>File</i> menu to create a
      new project or open an existing one.
    </Box>
  );
}

export default Homepage;
