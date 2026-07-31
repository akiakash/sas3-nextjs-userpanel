/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

export function AuctionColumn({
  options,
  selected,
  onToggle,
  emptyLabel = 'No auctions available',
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  emptyLabel?: string;
}) {
  return (
    <div className="auction-legacy-col">
      <div className="auction-legacy-col-head">Auction</div>
      <div className="auction-legacy-col-body">
        {options.length === 0 ? (
          <p className="auction-legacy-empty">{emptyLabel}</p>
        ) : options.map(opt => (
          <label key={opt} className="auction-legacy-check">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
