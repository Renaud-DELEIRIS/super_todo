import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import BoardCreateForm, { BoardCreateFormValues } from "./board-create-form";

export function BoardCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutateAsync: createBoard } = api.post.create.useMutation();
  const router = useRouter();
  const utils = api.useUtils();

  const onCreate = async (data: BoardCreateFormValues) => {
    try {
      const newBoard = await createBoard(data);
      utils.post.getAll.setData(undefined, (oldData) =>
        oldData ? [...(oldData ?? []), newBoard] : [newBoard],
      );
      router.push(`/board/${newBoard.id}`);
    } catch (error) {
      console.error("Failed to create board", error);
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new boards</DialogTitle>
          <DialogDescription>
            Create a new board to help you organize your tasks.
          </DialogDescription>
        </DialogHeader>
        <BoardCreateForm callback={onCreate} />
      </DialogContent>
    </Dialog>
  );
}
