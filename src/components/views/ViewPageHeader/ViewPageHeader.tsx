import React from 'react';
import { PageHeader } from '@toolpad/core';
import { ViewHeaderProps } from 'types/views';
import { ViewPageToolbar } from '../ViewPageToolbar';

export function ViewPageHeader(props: Readonly<ViewHeaderProps>) {
  const CustomPageToolbarComponent = React.useCallback(
    () => <ViewPageToolbar {...props} />,
    [props]
  );
  return <PageHeader slots={{ toolbar: CustomPageToolbarComponent }} {...props} />;
}
