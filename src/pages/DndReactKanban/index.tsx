import update from "immutability-helper";
import { useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Col from "../../components/Col";
import Droppable from "../../components/dndReact/Droppable";
import SortableItem from "../../components/dndReact/SortableItem";
import Item from "../../components/Item";
import { IItem } from "../../utils/interfaces";

import "./styles.css";

function DndReactKanbanContent() {
  const [cols, setCols] = useState<Record<string, number[]>>({
    col1: [1, 2, 3, 4],
    col2: [5, 6, 7, 8],
    col3: [9, 10, 11, 12],
  });

  const handleMoveItem = useCallback(
    (dragIndex: number, hoverIndex: number, idContainer: string) => {
      setCols((prevCols) => {
        const prevItems = prevCols[idContainer];
        return {
          ...prevCols,
          [idContainer]: update(prevItems, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevItems[dragIndex]],
            ],
          }),
        };
      });
    },
    []
  );

  const handleDrop = (item: IItem, idContainer: string) => {
    setCols((prevCols) => {
      const activeContainer = item.idContainer;
      const dropContainer = idContainer;

      return {
        ...cols,
        [activeContainer]: cols[activeContainer].filter((it) => it !== item.id),
        [dropContainer]: cols[dropContainer].concat(item.id),
      };
    });
  };

  const renderItem = useCallback(
    (item: number, index: number, idContainer: string) => {
      if (item == null) {
        return null;
      }

      return (
        <SortableItem
          key={item}
          id={item}
          index={index}
          idContainer={idContainer}
          moveItem={handleMoveItem}
        >
          <Item title={item.toString()} />
        </SortableItem>
      );
    },
    []
  );

  const renderCol = useCallback(
    (col: string) => {
      const items = cols[col];
      return (
        <Col title={col} key={col}>
          <Droppable id={col} onDrop={handleDrop}>
            {items.map((item, index) => renderItem(item, index, col))}
          </Droppable>
        </Col>
      );
    },
    [cols]
  );

  return (
    <div className="dnd-react-kanban-container">
      {Object.keys(cols).map(renderCol)}
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
