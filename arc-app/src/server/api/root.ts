import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { walletRouter } from "./routers/wallet";
import { nfcRouter } from "./routers/nfc";
import { passRouter } from "./routers/pass";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  wallet: walletRouter,
  nfc: nfcRouter,
  pass: passRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
