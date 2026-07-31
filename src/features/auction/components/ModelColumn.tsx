/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

export function ModelColumn({
  options,
  selected,
  counts,
  countsLoading,
  onToggle,
  emptyLabel,
}: {
  options: string[];
  selected: string[];
  counts?: Record<string, number>;
  countsLoading?: boolean;
  onToggle: (value: string) => void;
  emptyLabel?: string;
}) {
  return (
    <div className="auction-legacy-col">
      <div className="auction-legacy-col-head">Model</div>
      <div className="auction-legacy-col-body">
        {options.length === 0 ? (
          <p className="auction-legacy-empty">{emptyLabel ?? 'No models'}</p>
        ) : (
          options.map(opt => {
            const count = counts?.[opt];
            const showCount = counts != null && count !== undefined;

            return (
              <label key={opt} className="auction-legacy-check">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => onToggle(opt)}
                />
                <span className="auction-legacy-option-label">
                  <span className="auction-legacy-option-name">{opt}</span>
                  {showCount && (
                    <span className="auction-legacy-option-count">[{count}]</span>
                  )}
                  {countsLoading && !showCount && (
                    <span className="auction-legacy-option-count is-loading">[…]</span>
                  )}
                </span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
