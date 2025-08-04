import React, { lazy } from 'react';
import { Drawer, Box, useTheme, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { drawerActions, RootState } from 'store';
import { EntityType } from 'models';

export interface IDrawerProps {
  data: any;
  onClose: () => void;
}
const EditionForm = lazy(() => import('pages/reports-manager/forms/EditionForm'));
const CategoryForm = lazy(() => import('pages/reports-manager/forms/CategoryForm'));
const VariationForm = lazy(() => import('pages/reports-manager/forms/VariationForm'));
const SourceForm = lazy(() => import('pages/reports-manager/forms/SourceForm'));
const QuotaForm = lazy(() => import('pages/reports-manager/forms/QuotaForm'));
const CompetitorDisplay = lazy(() => import('pages/explorer/forms/CompetitorDisplay'));
const CompetitorUsdfDisplay = lazy(() => import('pages/explorer/forms/CompetitorUsdfDisplay'));
const EditGeneralForm = lazy(() => import('pages/tools/consolidation/components/EditGeneralForm'));
const DeliverDataScopeForm = lazy(() => import('pages/reports-manager/forms/DeliverDataScopeForm'));
const DeliveryPlanForm = lazy(() => import('pages/reports-manager/forms/DeliveryPlanForm'));
const SecurityUserForm = lazy(
  () => import('pages/tools/securityManager/components/SecurityUserForm')
);
const SecurityClientForm = lazy(
  () => import('pages/tools/securityManager/components/SecurityClientForm')
);
const AccessRequestDetail = lazy(
  () => import('pages/tools/securityManager/components/AccessRequestDetail')
);
const SharedDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.drawer.isOpen);
  const selectedItem = useSelector((state: RootState) => state.drawer.selectedItem);
  const type = useSelector((state: RootState) => state.drawer.type);
  const mode = useSelector((state: RootState) => state.drawer.mode);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = isSmallScreen ? '90%' : isMediumScreen ? '400px' : '650px';

  const getForm = () => {
    const handleClose = () => dispatch(drawerActions.closeDrawer());
    switch (type) {
      case EntityType.Edition:
        return (
          <EditionForm data={selectedItem} onClose={handleClose} editionMode={mode!} type={type} />
        );
      case EntityType.ReportCategory:
        return (
          <CategoryForm data={selectedItem} onClose={handleClose} editionMode={mode!} type={type} />
        );
      case EntityType.ReportVariation:
        return (
          <VariationForm
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      case EntityType.ReportSource:
        return (
          <SourceForm data={selectedItem} onClose={handleClose} editionMode={mode!} type={type} />
        );
      case EntityType.BiographyQuota:
        return (
          <QuotaForm data={selectedItem} onClose={handleClose} editionMode={mode!} type={type} />
        );
      case EntityType.AccessRequest:
        return (
          <AccessRequestDetail
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      case EntityType.SecurityUser:
        return (
          <SecurityUserForm
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      case EntityType.SecurityClient:
        return (
          <SecurityClientForm
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      case EntityType.Participant:
        return (
          <CompetitorDisplay
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      case EntityType.Competitor:
        return (
          <CompetitorUsdfDisplay
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      case EntityType.DeliveryDataScope:
        return (
          <DeliverDataScopeForm
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      case EntityType.DeliveryPlan:
        return (
          <DeliveryPlanForm
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      case EntityType.Event:
      case EntityType.Stage:
      case EntityType.Phase:
      case EntityType.Unit:
      case EntityType.SubUnit:
      case EntityType.Discipline:
      case EntityType.Result:
        return (
          <EditGeneralForm
            data={selectedItem}
            onClose={handleClose}
            editionMode={mode!}
            type={type}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={() => dispatch(drawerActions.closeDrawer())}
      sx={{ zIndex: 1301 }}
      slotProps={{
        paper: {
          style: { width: drawerWidth },
        },
      }}
    >
      <Box>{getForm()}</Box>
    </Drawer>
  );
};

export default SharedDrawer;
