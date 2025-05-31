import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'FIELD';

export const FieldItem = ({ id, text, index, moveField }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // Optionally: getBoundingClientRect() logic for fine control (if needed)

      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }

    // hover(item) {
    //   if (item.index === index) return;
    //   moveField(item.index, index);
    //   item.index = index;
    // }
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: '1px solid black',
        padding: '8px',
        marginBottom: '4px',
        backgroundColor: 'white',
        cursor: 'move'
      }}
    >
      {text}
    </div>
  );
};
