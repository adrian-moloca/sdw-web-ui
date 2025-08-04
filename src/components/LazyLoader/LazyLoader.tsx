import { Suspense } from 'react';
import { Loader } from '../Loader';

export const LazyLoader = (props: any) => {
  return (
    <Suspense fallback={<Loader />}>
      <props.component {...props} />
    </Suspense>
  );
};
