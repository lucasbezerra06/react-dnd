import {
  Active,
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  Over,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import Col from "../../components/Col";
import Droppable from "../../components/dndKit/Droppable";
import SortableItem from "../../components/dndKit/SortableItem";
import Item from "../../components/Item";
import { arrayMove, insertAtIndex, removeAtIndex } from "../../utils/array";

import "./styles.css";

export default function DndKitKanban() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [cols, setCols] = useState<Record<string, UniqueIdentifier[]>>({
    col1: [1, 2, 3, 4],
    col2: [5, 6, 7, 8],
    col3: [9, 10, 11, 12],
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd({ over, active }: DragEndEvent) {
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      setCols((cols) => {
        if (isItemOverAnotherContainer(active, over)) {
          return moveItemToAnotherContainer(active, over, cols);
        }

        const activeContainer = active.data.current?.sortable.containerId;
        return {
          ...cols,
          [activeContainer]: moveItem(active, over, cols[activeContainer]),
        };
      });
    }
    setActiveId(null);
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (isItemOverAnotherContainer(active, over)) {
      setCols((cols) => moveItemToAnotherContainer(active, over, cols));
    }
  };

  const moveItem = (active: Active, over: Over, items: UniqueIdentifier[]) => {
    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over?.id);

    return arrayMove(items, oldIndex, newIndex);
  };

  const moveItemToAnotherContainer = (
    active: Active,
    over: Over | null,
    cols: Record<string, UniqueIdentifier[]>
  ) => {
    const overContainer = over!.data.current?.sortable.containerId || over!.id;
    const activeContainer = active.data.current?.sortable.containerId;

    const activeIndex = active.data.current?.sortable.index;
    const overIndex =
      over!.id in cols
        ? cols[overContainer].length + 1
        : over!.data.current?.sortable.index;

    return {
      ...cols,
      [activeContainer]: removeAtIndex(cols[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(cols[overContainer], overIndex, active.id),
    };
  };

  const isItemOverAnotherContainer = (active: Active, over: Over | null) => {
    const overId = over?.id;
    if (!overId) {
      return false;
    }

    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;
    return activeContainer !== overContainer;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="dnd-kit-kanban-container">
        {Object.keys(cols).map((col) => {
          const items = cols[col];
          return (
            <Col title={col} key={col}>
              <Droppable id={col} items={items}>
                {items.map((item) => {
                  if (item == null) {
                    return null;
                  }
                  return (
                    <SortableItem
                      id={item}
                      key={item}
                      isActive={activeId === item}
                    >
                      <Item title={item.toString()} />
                    </SortableItem>
                  );
                })}
              </Droppable>
            </Col>
          );
        })}
        <DragOverlay>
          {activeId ? <Item title={activeId.toString()} isActive /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
