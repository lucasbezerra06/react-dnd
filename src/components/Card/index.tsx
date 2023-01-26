import { CardStatus } from "../../data";
import "./styles.css";

interface ICardProps {
  content?: string;
  status: CardStatus;
  isActive?: boolean;
}

const backgroundColors = {
  TO_DO: "#bdc800",
  IN_PROGRESS: "#0005a3",
  DONE: "#10a300",
};

export default function Card({ content, isActive, status }: ICardProps) {
  return (
    <div
      style={{
        transform: isActive ? "rotate(1deg)" : undefined,
        cursor: isActive ? "grabbing" : "pointer",
        // backgroundColor: backgroundColors[status],
      }}
      className="card-container"
    >
      <div className="card-header">
        <div
          className="card-status"
          style={{ backgroundColor: backgroundColors[status] }}
        />
      </div>
      <div className="card-content">{content}</div>
    </div>
  );
}
