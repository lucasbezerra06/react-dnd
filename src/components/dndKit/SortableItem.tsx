import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface ISortableItemProps {
  children?: React.ReactNode;
  id: UniqueIdentifier;
  isActive?: boolean;
}

export default function SortableItem({
  id,
  children,
  isActive
}: ISortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style: React.CSSProperties = {
    transition,
    opacity: isActive ? 0.1 : 1,
  };

  if (transform) {
    style.transform = CSS.Transform.toString(transform);
  }

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </li>
  );
}
