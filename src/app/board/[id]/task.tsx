import { Task } from "@prisma/client";
import { motion } from "framer-motion";
import { DragEvent } from "react";
import { DropIndicator } from "./drop-indicator";

export const TaskCard = ({
  task,
  columnId,
  handleDragStart,
}: {
  task: Task;
  columnId: string;
  handleDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void;
}) => {
  return (
    <>
      <DropIndicator beforeId={task.id} column={columnId} />
      <motion.div
        layout
        layoutId={task.id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e as unknown as DragEvent<HTMLDivElement>, task)
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{task.name}</p>
      </motion.div>
    </>
  );
};
