import "./styles.css";

interface IItemProps {
  title?: string;
  isActive?: boolean;
}

export default function Item({ title, isActive }: IItemProps) {
  return (
    <div
      style={{
        transform: isActive ? "rotate(1deg)" : undefined,
        cursor: isActive ? "grabbing" : "pointer",
      }}
      className="item-container"
    >
      {title}
    </div>
  );
}
