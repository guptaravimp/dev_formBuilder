import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    marginBottom: '6px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fafafa',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function SortableFormSteps() {
  const [formSteps, setFormSteps] = useState([
    { _id: 'step1', title: 'Step 1' },
    { _id: 'step2', title: 'Step 2' },
    { _id: 'step3', title: 'Step 3' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = formSteps.findIndex((step) => step._id === active.id);
      const newIndex = formSteps.findIndex((step) => step._id === over.id);

      setFormSteps((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={formSteps.map((step) => step._id)}
        strategy={verticalListSortingStrategy}
      >
        {formSteps.map((step) => (
          <SortableItem key={step._id} id={step._id}>
            {step.title}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
