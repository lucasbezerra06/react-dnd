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
import update from "immutability-helper";
import { useMemo, useState } from "react";
import Card from "../../components/Card";
import Col from "../../components/Col";
import Droppable from "../../components/dndKit/Droppable";
import SortableItem from "../../components/dndKit/SortableItem";
import { CardStatuses, data, ICard } from "../../data";

import { formatColTitle } from "../../utils/format";
import "./styles.css";

export default function DndKitKanban() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [cards, setCards] = useState(data);

  const activeCard = useMemo(
    () => cards.find((card) => card.id === activeId),
    [cards, activeId]
  );

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
      setCards((prevCards) => {
        if (isItemOverAnotherContainer(active, over)) {
          return moveItemToAnotherContainer(active, over, prevCards);
        }

        // const activeContainer = active.data.current?.sortable.containerId;
        console.log({ active, over, prevCards });
        return moveItem(active, over, prevCards);
      });
    }
    setActiveId(null);
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (isItemOverAnotherContainer(active, over)) {
      setCards((prevCards) =>
        moveItemToAnotherContainer(active, over!, prevCards)
      );
    }
  };

  const moveItem = (active: Active, over: Over, items: ICard[]) => {
    const oldIndex = items.findIndex((card) => card.id === active.id);
    const newIndex = items.findIndex((card) => card.id === over?.id);
    const item = items[oldIndex];

    return update(cards, {
      $splice: [
        [oldIndex, 1],
        [newIndex, 0, item],
      ],
    });
  };

  const moveItemToAnotherContainer = (
    active: Active,
    over: Over,
    cards: ICard[]
  ) => {
    const overContainer = over!.data.current?.sortable.containerId || over!.id;
    const activeIndex = cards.findIndex((card) => card.id === active.id);
    const overIndex = cards.findIndex((card) => card.id === over!.id);

    return update(cards, {
      $splice: [
        [activeIndex, 1],
        [overIndex, 0, { ...cards[activeIndex], status: overContainer }],
      ],
    });
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
        {CardStatuses.map((cardStatus) => {
          const items = cards.filter((card) => card.status === cardStatus);
          return (
            <Col title={formatColTitle(cardStatus)} key={cardStatus}>
              <Droppable id={cardStatus} items={items}>
                {items.map((item) => {
                  if (item == null) {
                    return null;
                  }
                  return (
                    <SortableItem
                      id={item.id}
                      key={item.id}
                      isActive={activeId === item.id}
                    >
                      <Card content={item.content} status={item.status} />
                    </SortableItem>
                  );
                })}
              </Droppable>
            </Col>
          );
        })}
        <DragOverlay>
          {activeCard != null ? (
            <Card
              content={activeCard.content}
              status={activeCard.status}
              isActive
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
