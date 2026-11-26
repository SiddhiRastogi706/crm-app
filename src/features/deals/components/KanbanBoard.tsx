import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { Deal, DealStage } from '@/lib/api/types';
import { KanbanColumn } from './KanbanColumn';
import { DealCard } from './DealCard';

interface KanbanBoardProps {
  deals: Deal[];
  onDealMove: (dealId: string, newStage: DealStage) => Promise<void>;
  onDealClick: (deal: Deal) => void;
  onAddDeal: (stage: DealStage) => void;
}

const STAGES: Array<{ id: DealStage; title: string; color: string }> = [
  { id: 'new', title: 'New Opportunities', color: '#94A3B8' },
  { id: 'contacted', title: 'Contacted', color: '#60A5FA' },
  { id: 'proposal', title: 'Proposal Sent', color: '#3B82F6' },
  { id: 'negotiation', title: 'Negotiation', color: '#2563EB' },
  { id: 'won', title: 'Closed Won', color: '#10B981' },
  { id: 'lost', title: 'Closed Lost', color: '#EF4444' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  deals,
  onDealMove,
  onDealClick,
  onAddDeal,
}) => {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  // Configure sensors with 8px threshold to differentiate clicks from drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find((d) => d.id === active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const activeId = active.id as string;
    const deal = deals.find((d) => d.id === activeId);
    if (!deal) return;

    // Check if over a column or another card
    let targetStage: DealStage | null = null;

    // Is over a column?
    if (over.data?.current?.type === 'Column') {
      targetStage = over.data.current.stage as DealStage;
    } else if (over.data?.current?.type === 'Deal') {
      targetStage = over.data.current.deal.stage as DealStage;
    }

    if (targetStage && targetStage !== deal.stage) {
      // If moving to won, celebrate with confetti!
      if (targetStage === 'won') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      await onDealMove(activeId, targetStage);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start">
        {STAGES.map((col) => {
          const colDeals = deals.filter((d) => d.stage === col.id);
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              deals={colDeals}
              onDealClick={onDealClick}
              onAddDeal={onAddDeal}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeDeal ? (
          <div className="rotate-2 scale-105 shadow-2xl">
            <DealCard deal={activeDeal} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
