import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

const isAuthed = t.middleware(async ({ next }) => {
  const user = { id: 1, name: 'Demo User' };
  return next({ ctx: { user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.name ?? 'World'}!`,
      };
    }),

  complexData: publicProcedure
    .input(z.object({
      id: z.number(),
      filter: z.string().optional(),
    }))
    .query(({ input }) => {
      return {
        id: input.id,
        timestamp: new Date().toISOString(),
        data: {
          title: 'Complex API Response',
          filter: input.filter,
          randomValue: Math.random(),
          nested: {
            field1: 'value1',
            field2: 'value2',
          }
        }
      };
    }),

  profile: protectedProcedure
    .query(({ ctx }) => {
      return {
        user: ctx.user,
        lastAccess: new Date().toISOString(),
      };
    }),

  createPost: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(100),
      content: z.string().min(10),
      tags: z.array(z.string()).min(1).max(5),
      isDraft: z.boolean().default(false),
    }))
    .mutation(({ input, ctx }) => {
      return {
        id: Math.floor(Math.random() * 10000),
        ...input,
        authorId: ctx.user.id,
        createdAt: new Date().toISOString(),
      };
    }),

  batchUpdate: protectedProcedure
    .input(z.array(z.object({
      id: z.number(),
      status: z.enum(['active', 'archived', 'deleted']),
    })))
    .mutation(({ input }) => {
      return input.map(item => ({
        ...item,
        updatedAt: new Date().toISOString(),
        success: true,
      }));
    }),

  posts: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().optional(),
      }))
      .query(({ input }) => {
        return {
          items: Array.from({ length: input.limit }, (_, i) => ({
            id: (input.cursor || 0) + i + 1,
            title: `Post ${(input.cursor || 0) + i + 1}`,
            excerpt: 'Lorem ipsum dolor sit amet...',
          })),
          nextCursor: (input.cursor || 0) + input.limit,
        };
      }),

    byId: publicProcedure
      .input(z.number())
      .query(({ input }) => {
        return {
          id: input,
          title: `Post ${input}`,
          content: 'Full post content...',
          createdAt: new Date().toISOString(),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;