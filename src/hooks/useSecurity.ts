import { useSelector } from 'react-redux';
import { EntityType, EditionFlagEnum, EditionFlags, ViewType, MenuFlagEnum } from 'models';
import { RootState } from 'store';
import { useNavigate } from 'react-router-dom';
import useAppRoutes from './useAppRoutes';

export function useSecurityProfile(): any {
  const navigate = useNavigate();
  const { baseRoutes } = useAppRoutes();
  const currentProfile = useSelector((state: RootState) => state.auth.profile);
  const hasPermission = (flag: MenuFlagEnum) => (currentProfile.flags & flag) !== 0;
  const checkPermission = (flag: MenuFlagEnum) => {
    if (!hasPermission(flag)) navigate(baseRoutes.Home);
  };
  return {
    profile: currentProfile,
    hasPermission,
    checkPermission,
  };
}

export function useSecurity(type: EntityType, view: ViewType, readOnly = false): any {
  const currentProfile = useSelector((state: RootState) => state.auth.profile);
  const hasConsolidation = (currentProfile.flags & MenuFlagEnum.Consolidation) !== 0;
  const hasGDSAdmin = (currentProfile.flags & MenuFlagEnum.ReportsSetup) !== 0;
  const mapProfile = () => {
    if (readOnly) return EditionFlags.AllowView;
    switch (view) {
      case ViewType.Index:
        if (
          type == EntityType.PersonBiography ||
          type == EntityType.HorseBiography ||
          type == EntityType.TeamBiography ||
          type == EntityType.NocBiography
        ) {
          return EditionFlags.AllowEditionWithDuplicate;
        }
        if (
          hasGDSAdmin &&
          (type == EntityType.Edition ||
            type == EntityType.ReportSource ||
            type == EntityType.ReportBlock ||
            type == EntityType.ReportField ||
            type == EntityType.ReportFilter ||
            type == EntityType.DeliveryPlan ||
            type == EntityType.DeliveryDataScope ||
            type == EntityType.ReportSection ||
            type == EntityType.ReportCategory ||
            type == EntityType.ReportVariation ||
            type == EntityType.BiographyQuota)
        ) {
          return EditionFlags.AllowEditionWithDuplicate;
        }
        return EditionFlags.AllowView;
      case ViewType.View:
        if (
          hasGDSAdmin &&
          (type == EntityType.Edition ||
            type == EntityType.ReportSource ||
            type == EntityType.ReportBlock ||
            type == EntityType.ReportField ||
            type == EntityType.ReportSection ||
            type == EntityType.ReportCategory ||
            type == EntityType.ReportVariation ||
            type == EntityType.BiographyQuota)
        ) {
          return EditionFlags.AllowEditionWithDuplicate;
        }
        if (hasConsolidation) return EditionFlags.AllowEditionNoCreate;
        return EditionFlags.AllowView;
      case ViewType.List:
        return EditionFlags.AllowView;
    }
    return EditionFlags.AllowView;
  };
  return {
    profile: currentProfile,
    flags: mapProfile(),
    canUpdate: canUpdate(mapProfile()),
    canDelete: canDelete(mapProfile()),
    canView: canView(mapProfile()),
    canCreate: canCreate(mapProfile()),
    canDuplicate: canDuplicate(mapProfile()),
  };
}

export function canUpdate(flags: EditionFlagEnum): boolean {
  return (flags & EditionFlagEnum.CanUpdate) === EditionFlagEnum.CanUpdate;
}
export function canDelete(flags: EditionFlagEnum): boolean {
  return (flags & EditionFlagEnum.CanDelete) === EditionFlagEnum.CanDelete;
}
export function canView(flags: EditionFlagEnum): boolean {
  return (flags & EditionFlagEnum.CanView) === EditionFlagEnum.CanView;
}
export function canCreate(flags: EditionFlagEnum): boolean {
  return (flags & EditionFlagEnum.CanCreate) === EditionFlagEnum.CanCreate;
}
export function canDuplicate(flags: EditionFlagEnum): boolean {
  return (flags & EditionFlagEnum.CanDuplicate) === EditionFlagEnum.CanDuplicate;
}
