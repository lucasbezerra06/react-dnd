import type { Identifier, XYCoord } from "dnd-core";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IItem } from "../../utils/interfaces";
import { ItemTypes } from "../../utils/ItemTypes";

interface ISortableItemProps {
  children?: React.ReactNode;
  id: number;
  index: number;
  idContainer: string;
  moveItem: (dragId: number, hoverId: number) => void;
  isActive?: boolean;
}

export default function SortableItem({
  children,
  id,
  idContainer,
  index,
  moveItem,
}: ISortableItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [{ handlerId }, drop] = useDrop<
    IItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.ITEM,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: IItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (item.idContainer !== idContainer) {
        return;
      }

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(item.id, id);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: () => {
      return { id, index, idContainer };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <li ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      {children}
    </li>
  );
}
