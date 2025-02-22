import React from 'react';
import { Card, CardData } from './Card';

interface CardGridProps {
  cards: CardData[];
  onCardClick?: (id: string) => void;
  onCardEdit?: (id: string) => void;
  viewMode?: 'list' | 'grid';
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardClick,
  onCardEdit,
  viewMode = 'grid'
}) => {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg
          className="w-16 h-16 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm">No cards yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 ${
        viewMode === 'list'
          ? 'grid-cols-1'
          : 'grid-cols-1 sm:grid-cols-2'
      }`}
    >
      {cards.map(card => (
        <Card
          key={card.id}
          data={card}
          onClick={onCardClick}
          onEdit={onCardEdit}
          className={viewMode === 'list' ? 'flex-row' : ''}
        />
      ))}
    </div>
  );
}; 