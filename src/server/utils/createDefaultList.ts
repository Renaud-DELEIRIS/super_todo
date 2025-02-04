import { Prisma, PrismaClient } from "@prisma/client";

const DEFAULT_LISTS: Omit<Prisma.ListCreateInput, "board">[] = [
  {
    name: "To Do",
    order: 0,
    color: "#4299E1",
  },
  {
    name: "In Progress",
    order: 1,
    color: "#F6AD55",
  },
  {
    name: "Done",
    order: 2,
    color: "#38A169",
  },
];

export const createDefaultList = (boardId: string, db: PrismaClient) => {
  return Promise.all(
    DEFAULT_LISTS.map((list) =>
      db.list.create({
        data: {
          ...list,
          boardId,
        },
      }),
    ),
  );
};
