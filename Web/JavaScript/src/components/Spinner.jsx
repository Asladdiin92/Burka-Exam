import React from "react";

export function Spinner() {
  return <div className="loading"><div className="spinner" /><span>Loading…</span></div>;
}

export function Skeleton({ width = "100%", height = 12, style }) {
  return <span className="skeleton" style={{ width, height, ...style }} aria-hidden="true" />;
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="skeleton-table" role="status" aria-label="Loading">
      <div className="skeleton-row skeleton-head">
        {Array.from({ length: cols }).map((_, c) => <Skeleton key={c} height={10} width={`${50 + ((c * 17) % 40)}%`} />)}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div className="skeleton-row" key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={`${45 + (((r + 1) * (c + 3) * 13) % 50)}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div className="stats-grid" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-header">
            <Skeleton width="55%" height={10} />
            <Skeleton width={38} height={38} style={{ borderRadius: 10 }} />
          </div>
          <Skeleton width="40%" height={26} style={{ marginTop: 6 }} />
        </div>
      ))}
    </div>
  );
}
