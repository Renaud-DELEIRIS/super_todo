import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createDefaultList } from "@/server/utils/createDefaultList";

export const boardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      const newBoard = await db.board.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });

      await createDefaultList(newBoard.id, db);

      const newAccess = await db.boardAccess.create({
        data: {
          boardId: newBoard.id,
          userId: session.user.id,
          role: "OWNER",
        },
      });

      return {
        ...newBoard,
        boardAccess: [newAccess],
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      const board = await db.board.findFirst({
        where: {
          id: input.id,
          boardAccess: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          boardAccess: true,
        },
      });

      if (!board) {
        throw new Error("Board not found");
      }

      const access = board.boardAccess.find(
        (access) => access.userId === session.user.id,
      )!;

      if (access.role !== "OWNER") {
        throw new Error("You do not have permission to update this board");
      }

      return db.board.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    return db.board.findMany({
      where: {
        boardAccess: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        boardAccess: true,
      },
    });
  }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx: { db, session } }) => {
      const board = await db.board.findFirst({
        where: {
          id: input.id,
          boardAccess: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          boardAccess: true,
          List: {
            orderBy: {
              order: "asc",
            },
            include: {
              tasks: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      });

      if (!board) {
        throw new Error("Board not found");
      }

      return board;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx: { db, session } }) => {
      const board = await db.board.findFirst({
        where: {
          id: input,
          boardAccess: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          boardAccess: true,
        },
      });

      if (!board) {
        throw new Error("Board not found");
      }

      const access = board.boardAccess.find(
        (access) => access.userId === session.user.id,
      )!;

      if (access.role !== "OWNER") {
        throw new Error("You do not have permission to delete this board");
      }

      await db.boardAccess.deleteMany({
        where: {
          boardId: input,
        },
      });

      return db.board.delete({
        where: {
          id: input,
        },
      });
    }),

  createTask: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        listId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      const board = await db.board.findFirst({
        where: {
          id: input.boardId,
          boardAccess: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          boardAccess: true,
        },
      });

      if (!board) {
        throw new Error("Board not found");
      }

      const access = board.boardAccess.find(
        (access) => access.userId === session.user.id,
      )!;

      if (access.role !== "OWNER" && access.role !== "EDITOR") {
        throw new Error(
          "You do not have permission to create tasks on this board",
        );
      }

      const list = await db.list.findFirst({
        where: {
          id: input.listId,
          boardId: input.boardId,
        },
        include: {
          tasks: true,
        },
      });

      if (!list) {
        throw new Error("List not found");
      }

      const maxOrder = list.tasks.reduce(
        (max, task) => Math.max(max, task.order),
        0,
      );

      return db.task.create({
        data: {
          name: input.name,
          listId: input.listId,
          order: maxOrder + 1,
        },
      });
    }),

  moveTask: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        taskId: z.string(),
        listId: z.string(),
        before: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      const board = await db.board.findFirst({
        where: {
          id: input.boardId,
          boardAccess: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          boardAccess: true,
        },
      });

      if (!board) {
        throw new Error("Board not found");
      }

      const access = board.boardAccess.find(
        (access) => access.userId === session.user.id,
      )!;

      if (access.role !== "OWNER" && access.role !== "EDITOR") {
        throw new Error(
          "You do not have permission to move tasks on this board",
        );
      }

      const task = await db.task.findFirst({
        where: {
          id: input.taskId,
          list: {
            boardId: input.boardId,
          },
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      const list = await db.list.findFirst({
        where: {
          id: input.listId,
          boardId: input.boardId,
        },
        include: {
          tasks: true,
        },
      });

      if (!list) {
        throw new Error("List not found");
      }

      const maxOrder = list.tasks.reduce(
        (max, task) => Math.max(max, task.order),
        0,
      );

      await db.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          listId: input.listId,
          order: input.before
            ? list.tasks.find((task) => task.id === input.before)!.order
            : maxOrder + 1,
        },
      });

      if (input.before) {
        await db.task.updateMany({
          where: {
            AND: [
              { listId: input.listId },
              {
                order: {
                  gte: list.tasks.find((task) => task.id === input.before)!
                    .order,
                },
              },
              {
                id: {
                  not: input.taskId,
                },
              },
            ],
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      }

      return db.task.findFirst({
        where: {
          id: input.taskId,
        },
      });
    }),
  deleteTask: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        taskId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      const board = await db.board.findFirst({
        where: {
          id: input.boardId,
          boardAccess: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          boardAccess: true,
        },
      });

      if (!board) {
        throw new Error("Board not found");
      }

      const access = board.boardAccess.find(
        (access) => access.userId === session.user.id,
      )!;

      if (access.role !== "OWNER" && access.role !== "EDITOR") {
        throw new Error(
          "You do not have permission to delete tasks on this board",
        );
      }

      const task = await db.task.findFirst({
        where: {
          id: input.taskId,
          list: {
            boardId: input.boardId,
          },
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      await db.task.delete({
        where: {
          id: input.taskId,
        },
      });

      await db.task.updateMany({
        where: {
          AND: [
            { list: { boardId: input.boardId } },
            {
              order: {
                gte: task.order,
              },
            },
            {
              id: {
                not: input.taskId,
              },
            },
          ],
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      return task;
    }),
});
