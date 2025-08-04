import React, { useState } from 'react';
import FilterListOffOutlined from '@mui/icons-material/FilterListOffOutlined';
import { Typography, Tooltip, Grid, Button, Badge, styled, BadgeProps } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { t } from 'i18next';
import { filtersByType, FilterState, FilterType } from './types';
import { useFormik } from 'formik';
import {
  Checkbox,
  MainCard,
  NumberInput,
  SelectEnum,
  SelectMasterData,
  SelectSeason,
  StyledIconButton,
} from 'components';
import { DataType, EnumType, MasterData, useEnums } from 'models';
import { countActiveFilters } from './utils';
import { olympicsDesignColors } from 'themes/colors';

type Props = {
  filters: FilterState;
  type: FilterType;
  onFilterChange: (filters: FilterState) => void;
  onClean: () => void;
  onDownload?: () => void;
  loading?: boolean;
  downloading?: boolean;
  defaultOpen?: boolean;
};
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -7,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));
export const FilterPanel: React.FC<Props> = ({
  type,
  filters,
  onClean,
  onFilterChange,
  onDownload,
  downloading,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const { getEnumValues } = useEnums();
  const activeFilters = filtersByType[type];
  const initialValues = filters;
  const formik = useFormik<FilterState>({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values: FilterState) => {
      onFilterChange(values);
    },
  });
  return (
    <Grid
      size={12}
      container
      component={MainCard}
      content={false}
      title={
        <>
          {open ? (
            <Typography variant="h6">{t('general.filters')}</Typography>
          ) : (
            <Tooltip title={t('general.filters')}>
              <StyledBadge badgeContent={countActiveFilters(formik.values)} color="primary">
                <StyledIconButton
                  onClick={() => setOpen(!open)}
                  size="small"
                  aria-label={'Filter icon'}
                >
                  <FilterListOutlinedIcon fontSize="small" />
                </StyledIconButton>
              </StyledBadge>
            </Tooltip>
          )}
        </>
      }
      secondary={
        <Button
          onClick={() => setOpen(!open)}
          variant="outlined"
          color="secondary"
          startIcon={open ? <ChevronLeftOutlinedIcon /> : <ChevronRightOutlinedIcon />}
        >
          {open ? t('actions.collapse-filters') : t('actions.open-filters')}
        </Button>
      }
      headerSX={{ px: 0, py: 1 }}
      divider={false}
      sx={[
        (theme) => ({
          transition: 'width 0.3s',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 1,
          px: 4,
          py: open ? 1 : 0,
          background: theme.palette.background.default,
        }),
        (theme) =>
          theme.applyStyles('dark', {
            transition: 'width 0.3s',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 1,
            px: 4,
            py: open ? 1 : 0,
            background: olympicsDesignColors.dark.general.background,
          }),
      ]}
    >
      {open && (
        <Grid
          container
          rowSpacing={0}
          columnSpacing={1}
          component={'form'}
          onSubmit={formik.handleSubmit}
        >
          {activeFilters.includes('fromYear') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectSeason
                field={'fromYear'}
                formik={formik}
                size="small"
                findByKey={true}
                label={t('general.from-season')}
              />
            </Grid>
          )}
          {activeFilters.includes('toYear') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectSeason
                field={'toYear'}
                formik={formik}
                size="small"
                findByKey={true}
                label={t('general.to-season')}
              />
            </Grid>
          )}
          {activeFilters.includes('categories') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.CompetitionCategory}
                field={'categories'}
                formik={formik}
                findByKey={true}
                size="small"
                label={t('general.competitionCategories')}
                filter={(x: any) =>
                  x.key === 'CCAT$OLYMPIC_GAMES' ||
                  x.key === 'CCAT$SUMMER' ||
                  x.key === 'CCAT$WINTER' ||
                  x.key === 'CCAT$INTERCALATED_GAMES' ||
                  x.key === 'CCAT$YOUTH'
                }
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('sports') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.Sport}
                field={'sports'}
                size="small"
                formik={formik}
                findByKey={true}
                label={t('general.sports')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('disciplines') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.Discipline}
                field={'disciplines'}
                size="small"
                formik={formik}
                findByKey={true}
                label={t('general.disciplines')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('nocs') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.Noc}
                field={'nocs'}
                formik={formik}
                size="small"
                findByKey={true}
                label={t('general.nocs')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('countries') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.Country}
                field={'countries'}
                formik={formik}
                size="small"
                findByKey={true}
                label={t('general.countries')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('continents') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.Continent}
                field={'continents'}
                formik={formik}
                size="small"
                findByKey={true}
                label={t('general.noc-continents')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('competitorTypes') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectEnum
                field={'competitorTypes'}
                size="small"
                formik={formik}
                findByKey={true}
                label={t('general.participationTypes')}
                type={DataType.MultiSelect}
                options={getEnumValues(EnumType.ParticipantType) ?? []}
              />
            </Grid>
          )}
          {activeFilters.includes('eventTypes') && (
            <Grid size={{ xs: 12, md: 7, lg: 5 }}>
              <SelectMasterData
                category={MasterData.EventType}
                field={'eventTypes'}
                size="small"
                formik={formik}
                findByKey={true}
                filter={
                  formik.values.disciplines && formik.values.disciplines.length > 0
                    ? (x: any) =>
                        formik.values.disciplines!.some((prefix: string) =>
                          x.key?.startsWith(prefix.replace('SDIS', 'EVNT').replace('=', ''))
                        )
                    : undefined
                }
                label={t('general.events')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('eventGenders') && (
            <Grid size={{ xs: 12, md: 5, lg: 3 }}>
              <SelectMasterData
                category={MasterData.SportGender}
                field={'eventGenders'}
                size="small"
                formik={formik}
                findByKey={true}
                label={`${t('general.event')} ${t('general.genders')}`}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('genders') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.PersonGender}
                field={'genders'}
                size="small"
                formik={formik}
                findByKey={true}
                label={t('general.participant-genders')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('phaseTypes') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.RoundType}
                field={'phaseTypes'}
                size="small"
                formik={formik}
                findByKey={true}
                label={t('general.rounds')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('unitTypes') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.UnitType}
                field={'unitTypes'}
                size="small"
                formik={formik}
                findByKey={true}
                label={t('general.unitTypes')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('rank') && (
            <Grid size={{ xs: 12, md: 4, lg: 2 }}>
              <NumberInput field={'rank'} formik={formik} size="small" label={t('general.rank')} />
            </Grid>
          )}
          {activeFilters.includes('awards') && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <SelectMasterData
                category={MasterData.AwardSubClass}
                field={'awards'}
                formik={formik}
                size="small"
                findByKey={true}
                label={t('general.awards')}
                type={DataType.MultiSelect}
              />
            </Grid>
          )}
          {activeFilters.includes('isDemo') && (
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <Checkbox
                field={'isDemo'}
                formik={formik}
                size="small"
                label={t('general.is-demo')}
              />
            </Grid>
          )}
          <Grid
            size={{ xs: 12, md: 12 }}
            sx={{ display: 'flex', justifyContent: 'end', mt: 1, mb: 2 }}
          >
            <Button
              startIcon={<FilterListOffOutlined />}
              variant="outlined"
              color="secondary"
              size="small"
              onClick={onClean}
              sx={{ mr: 1 }}
              aria-label={t('actions.buttonClearFilters')}
            >
              {t('actions.buttonClearFilters')}
            </Button>
            {/* <Box sx={{ flexGrow: 1 }} /> */}
            <Button
              loadingPosition="start"
              type="submit"
              variant="contained"
              size="small"
              disableElevation
              startIcon={<FilterListOutlinedIcon />}
              aria-label={t('actions.applyFilters')}
            >
              {t('actions.applyFilters')}
            </Button>
            {onDownload && (
              <Button
                startIcon={<FileDownloadOutlinedIcon />}
                variant="contained"
                size="small"
                disableElevation
                loading={downloading}
                onClick={() => onDownload()}
                sx={{ ml: 1 }}
                aria-label={t('actions.buttonDownload')}
              >
                {t('actions.buttonDownload')}
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
