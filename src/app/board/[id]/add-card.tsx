import { api } from "@/trpc/react";
import { Task } from "@prisma/client";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";

export const AddCard = ({
  column,
  setCards,
  boardId,
}: {
  column: string;
  setCards: React.Dispatch<React.SetStateAction<Task[]>>;
  boardId: string;
}) => {
  const { mutateAsync: createTask } = api.post.createTask.useMutation();
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = await createTask({
      name: text,
      listId: column,
      boardId,
    });

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <Plus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <Plus />
        </motion.button>
      )}
    </>
  );
};
