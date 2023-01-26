import update from "immutability-helper";
import { useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "../../components/Card";
import Col from "../../components/Col";
import Droppable from "../../components/dndReact/Droppable";
import SortableItem from "../../components/dndReact/SortableItem";
import { CardStatus, CardStatuses, data, ICard } from "../../data";
import { IItem } from "../../utils/interfaces";

import "./styles.css";

function DndReactKanbanContent() {
  const [cards, setCards] = useState(data);

  const handleMoveItem = useCallback((dragId: number, hoverId: number) => {
    setCards((prevCards) => {
      const dragIndex = prevCards.findIndex((card) => card.id === dragId);
      const hoverIndex = prevCards.findIndex((card) => card.id === hoverId);
      return update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      });
    });
  }, []);

  const handleDrop = (item: IItem, idContainer: string) => {
    setCards((prevCards) => {
      const activeCard = prevCards.find((card) => card.id === item.id);
      if (activeCard != null) {
        return prevCards
          .filter((card) => card.id !== item.id)
          .concat({ ...activeCard, status: idContainer as CardStatus });
      }
      return prevCards;
    });
  };

  const renderCard = useCallback((card: ICard, index: number) => {
    if (card == null) {
      return null;
    }

    return (
      <SortableItem
        key={card.id}
        id={card.id}
        index={index}
        idContainer={card.status}
        moveItem={handleMoveItem}
      >
        <Card content={card.content} status={card.status} />
      </SortableItem>
    );
  }, []);

  const renderCol = useCallback(
    (cardStatus: CardStatus) => {
      return (
        <Col title={formatColTitle(cardStatus)} key={cardStatus}>
          <Droppable id={cardStatus} onDrop={handleDrop}>
            {cards
              .filter((card) => card.status === cardStatus)
              .map((card, index) => renderCard(card, index))}
          </Droppable>
        </Col>
      );
    },
    [cards]
  );

  return (
    <div className="dnd-react-kanban-container">
      {CardStatuses.map(renderCol)}
    </div>
  );
}

export default function DndReactKanban() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DndReactKanbanContent />
    </DndProvider>
  );
}

function formatColTitle(title: string) {
  return title.replace("_", " ");
}
