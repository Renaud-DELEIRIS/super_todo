import { api } from "@/trpc/react";
import type { Task } from "@prisma/client";
import { Flame, Trash } from "lucide-react";
import { type DragEvent, useState } from "react";

export const BurnBarrel = ({
  setCards,
  boardId,
}: {
  setCards: React.Dispatch<React.SetStateAction<Task[]>>;
  boardId: string;
}) => {
  const [active, setActive] = useState(false);
  const { mutateAsync: deleteCard } = api.post.deleteTask.useMutation();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
    void deleteCard({ taskId: cardId, boardId });
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <Flame className="animate-bounce" /> : <Trash />}
    </div>
  );
};
