import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { SortableContext, SortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React from "react";

import './styles.css';

interface IDroppableProps {
    children?: React.ReactNode;
    id: string;
    items: (UniqueIdentifier | {
        id: UniqueIdentifier;
    })[];
    strategy?: SortingStrategy;
}

export default function Droppable({ id, children, items, strategy = verticalListSortingStrategy }: IDroppableProps) {
    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <SortableContext
            id={id}
            items={items}
            strategy={strategy}
        >
            <ul className="droppable" ref={setNodeRef}>
                {children}
            </ul>
        </SortableContext>
    );
}
