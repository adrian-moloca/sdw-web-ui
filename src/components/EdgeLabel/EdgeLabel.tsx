import { FC } from 'react';

export const EdgeLabel: FC<{ transform: string; label: string }> = ({ transform, label }) => {
  return (
    <div
      style={{
        position: 'absolute',
        background: 'transparent',
        padding: 5,
        fontSize: 12,
        transform,
      }}
      className="nodrag nopan"
    >
      {label}
    </div>
  );
};
