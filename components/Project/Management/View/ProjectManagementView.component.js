import { Box, SwipeableDrawer } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/styles';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ManagementCapsSection from './Sections/ManagementCapsSection';
import ManagementCoreSection from './Sections/ManagementCoreSection';

const drawerBleeding = 35;

const ProjectManagementView = ({ project, projectManagement }) => {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (isOpen) => () => {
    setOpenDrawer(isOpen);
  };
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
  }));

  const Puller = styled(Box)(({ theme }) => ({
    width: 6,
    height: 30,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[900],
    borderRadius: 3,
  }));

  return (
    <Box className="ProjectManagementView ProjectManagementView__Container">
      <Box className="ProjectManagementView__Section Main">
        <ManagementCapsSection projectManagement={projectManagement} />
      </Box>
      {isMobile ? (
        <SwipeableDrawer
          className="ProjectManagementView__SectionsDrawer__Drawer"
          anchor="right"
          open={openDrawer}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            className="ProjectManagementView__SectionsDrawer__Puller"
            sx={{
              left: -drawerBleeding,
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <Puller />
          </StyledBox>
          <ManagementCoreSection
            project={project}
            projectManagement={projectManagement}
          />
        </SwipeableDrawer>
      ) : (
        <Box className="ProjectManagementView__Section Side">
          <ManagementCoreSection
            project={project}
            projectManagement={projectManagement}
          />
        </Box>
      )}
    </Box>
  );
};

ProjectManagementView.defaultProps = {
  isAdmin: false,
  projectManagementActions: {},
};

ProjectManagementView.propTypes = {
  project: PropTypes.object.isRequired,
  projectManagement: PropTypes.object.isRequired,
  projectManagementActions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
};

export default ProjectManagementView;
