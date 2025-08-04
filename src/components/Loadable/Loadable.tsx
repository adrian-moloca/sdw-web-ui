import { JSX, Suspense } from 'react';
import { Loader } from '../Loader';

export const Loadable = (Component: any) =>
  function WrappedComponent(props: JSX.IntrinsicAttributes) {
    return (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );
  };
