import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";

let io: Server | null = null;

/**
 * Initializes the Socket.IO server and sets up authentication and event handling.
 * @param httpServer - The HTTP server to attach the Socket.IO server to.
 * @returns The initialized Socket.IO server.
 */
export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer);

  // Authenticate socket connections using Better Auth
  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({ headers: fromNodeHeaders(socket.handshake.headers) });
      if (!session) return next(new Error("Authentication error"));
      socket.data.userId = session.user.id;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  // Handle socket connections and typing events
  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId}`);

    socket.on("typing", (payload) => {
      if (typeof payload?.toUserId !== "string") return;
      io!.to(`user:${payload.toUserId}`).emit("typing", {
        fromUserId: socket.data.userId,
        isTyping: !!payload.isTyping,
      });
    });
  });

  return io;
}

/**
 * Returns the initialized Socket.IO server instance.
 * @returns The Socket.IO server instance.
 */
export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}