"use client";
import { api } from "@/trpc/react";
import { useState } from "react";
import { BurnBarrel } from "./burn-barrel";
import { ListColumn } from "./list";

export const Board = ({ id }: { id: string }) => {
  const [boards] = api.post.get.useSuspenseQuery({
    id: id,
  });

  const [tasks, setTasks] = useState(
    boards.List.map((list) => list.tasks).flat(),
  );

  return (
    <div className="flex h-full w-full gap-3 overflow-auto p-12">
      {boards.List.map((list) => (
        <ListColumn
          key={list.id}
          {...list}
          tasks={tasks}
          boardId={id}
          setTasks={setTasks}
        />
      ))}
      <BurnBarrel setCards={setTasks} boardId={id} />
    </div>
  );
};
