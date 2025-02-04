import { api } from "@/trpc/react";
import type { List, Task } from "@prisma/client";
import { type Dispatch, type DragEvent, useState } from "react";
import { AddCard } from "./add-card";
import { DropIndicator } from "./drop-indicator";
import { TaskCard } from "./task";

export const ListColumn = ({
  name,
  color,
  tasks,
  id,
  setTasks,
  boardId,
}: List & {
  tasks: Task[];
  setTasks: Dispatch<React.SetStateAction<Task[]>>;
  boardId: string;
}) => {
  const [active, setActive] = useState(false);
  const { mutateAsync: moveTask } = api.post.moveTask.useMutation();

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData("cardId", task.id);
  };

  const handleDragEnd = async (e: DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...tasks];

      let cardToTransfer = copy.find((c) => c.id === cardId);

      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, listId: id };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setTasks(copy);
      await moveTask({
        boardId,
        taskId: cardId,
        listId: id,
        before: before === "-1" ? undefined : before,
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: Element[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      if (i instanceof HTMLElement) i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    if (el && el.element instanceof HTMLElement) el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: DragEvent<HTMLDivElement>,
    indicators: HTMLElement[],
  ) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1]!,
      },
    );

    return el;
  };

  const getIndicators = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return Array.from(
      document.querySelectorAll(`[data-column="${id}"]`),
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = tasks.filter((c) => c.listId === id);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium`} style={{ color: color }}>
          {name}
        </h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return (
            <TaskCard
              key={c.id}
              task={c}
              columnId={id}
              handleDragStart={handleDragStart}
            />
          );
        })}
        <DropIndicator beforeId={null} column={id} />
        <AddCard column={id} setCards={setTasks} boardId={boardId} />
      </div>
    </div>
  );
};
