import { useDrop } from "react-dnd";
import { IItem } from "../../../utils/interfaces";
import { ItemTypes } from "../../../utils/ItemTypes";
import "./styles.css";

interface IDroppableProps {
  id: string;
  children?: React.ReactNode;
  onDrop: (item: IItem, idContainer: string) => void;
}

export default function Droppable({ children, id, onDrop }: IDroppableProps) {
  const [{ isOver }, drop] = useDrop<IItem, void, { isOver: boolean }>({
    accept: ItemTypes.ITEM,
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.getItem().idContainer !== id,
    }),
    drop(item) {
      if (item.idContainer === id) {
        return;
      }
      onDrop(item, id);
    },
  });

  return (
    <ul ref={drop} className={`droppable${isOver ? " highlight" : ""}`}>
      {children}
    </ul>
  );
}
