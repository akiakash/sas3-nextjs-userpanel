/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

export function MakeColumn({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
}) {
  const activeMake = selected[0];

  return (
    <div className="auction-legacy-col">
      <div className="auction-legacy-col-head">Make</div>
      <div className="auction-legacy-col-body">
        <div className="auction-legacy-make-list">
          {options.length === 0 ? (
            <p className="auction-legacy-empty">No makes available</p>
          ) : (
            options.map(opt => {
              const active = activeMake === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={`auction-legacy-make-item${active ? ' active' : ''}`}
                  onClick={() => onSelect(opt)}
                >
                  {opt.charAt(0) + opt.slice(1).toLowerCase()}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
