import { makeExecutableSchema } from "@graphql-tools/schema";
import { prisma } from "@/lib/prisma";
import { isWithinPerimeter } from "@/lib/geo";
import type { GraphQLContext } from "./context";

const typeDefs = /* GraphQL */ `
  enum Role {
    MANAGER
    CARE_WORKER
  }

  type User {
    id: ID!
    email: String!
    name: String
    role: Role
  }

  type Perimeter {
    id: ID!
    label: String!
    latitude: Float!
    longitude: Float!
    radiusMeters: Int!
  }

  type Shift {
    id: ID!
    user: User!
    clockInAt: String!
    clockInLat: Float!
    clockInLng: Float!
    clockInNote: String
    clockOutAt: String
    clockOutLat: Float
    clockOutLng: Float
    clockOutNote: String
  }

  type Query {
    me: User
    currentPerimeter: Perimeter
    myActiveShift: Shift
    myShifts: [Shift!]!
    currentlyClockedIn: [Shift!]!
    allShifts: [Shift!]!
  }

  type Mutation {
    clockIn(lat: Float!, lng: Float!, note: String): Shift!
    clockOut(lat: Float!, lng: Float!, note: String): Shift!
    setPerimeter(
      label: String!
      latitude: Float!
      longitude: Float!
      radiusMeters: Int!
    ): Perimeter!
  }
`;

function requireUser(ctx: GraphQLContext) {
  if (!ctx.dbUser) throw new Error("Not authenticated");
  return ctx.dbUser;
}

function requireManager(ctx: GraphQLContext) {
  const user = requireUser(ctx);
  if (user.role !== "MANAGER") throw new Error("Manager role required");
  return user;
}

function getActivePerimeter() {
  return prisma.perimeter.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

const resolvers = {
  Shift: {
    clockInAt: (parent: { clockInAt: Date }) => parent.clockInAt.toISOString(),
    clockOutAt: (parent: { clockOutAt: Date | null }) =>
      parent.clockOutAt ? parent.clockOutAt.toISOString() : null,
    user: (parent: { user?: unknown; userId: string }) =>
      parent.user ?? prisma.user.findUniqueOrThrow({ where: { id: parent.userId } }),
  },

  Query: {
    me: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => ctx.dbUser,

    currentPerimeter: () => getActivePerimeter(),

    myActiveShift: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const user = requireUser(ctx);
      return prisma.shift.findFirst({
        where: { userId: user.id, clockOutAt: null },
        orderBy: { clockInAt: "desc" },
      });
    },

    myShifts: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const user = requireUser(ctx);
      return prisma.shift.findMany({
        where: { userId: user.id },
        orderBy: { clockInAt: "desc" },
      });
    },

    currentlyClockedIn: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      requireManager(ctx);
      return prisma.shift.findMany({
        where: { clockOutAt: null },
        include: { user: true },
        orderBy: { clockInAt: "desc" },
      });
    },

    allShifts: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      requireManager(ctx);
      return prisma.shift.findMany({
        include: { user: true },
        orderBy: { clockInAt: "desc" },
        take: 200,
      });
    },
  },

  Mutation: {
    clockIn: async (
      _parent: unknown,
      args: { lat: number; lng: number; note?: string },
      ctx: GraphQLContext,
    ) => {
      const user = requireUser(ctx);

      const existing = await prisma.shift.findFirst({
        where: { userId: user.id, clockOutAt: null },
      });
      if (existing) throw new Error("You are already clocked in.");

      const perimeter = await getActivePerimeter();
      if (!perimeter) {
        throw new Error("No perimeter has been configured yet.");
      }

      if (!isWithinPerimeter({ lat: args.lat, lng: args.lng }, perimeter)) {
        throw new Error(
          `You are outside the ${perimeter.label} perimeter and cannot clock in.`,
        );
      }

      return prisma.shift.create({
        data: {
          userId: user.id,
          clockInLat: args.lat,
          clockInLng: args.lng,
          clockInNote: args.note,
        },
      });
    },

    clockOut: async (
      _parent: unknown,
      args: { lat: number; lng: number; note?: string },
      ctx: GraphQLContext,
    ) => {
      const user = requireUser(ctx);

      const active = await prisma.shift.findFirst({
        where: { userId: user.id, clockOutAt: null },
      });
      if (!active) throw new Error("You are not currently clocked in.");

      return prisma.shift.update({
        where: { id: active.id },
        data: {
          clockOutAt: new Date(),
          clockOutLat: args.lat,
          clockOutLng: args.lng,
          clockOutNote: args.note,
        },
      });
    },

    setPerimeter: async (
      _parent: unknown,
      args: {
        label: string;
        latitude: number;
        longitude: number;
        radiusMeters: number;
      },
      ctx: GraphQLContext,
    ) => {
      const manager = requireManager(ctx);

      return prisma.$transaction(async (tx) => {
        await tx.perimeter.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });

        return tx.perimeter.create({
          data: {
            label: args.label,
            latitude: args.latitude,
            longitude: args.longitude,
            radiusMeters: args.radiusMeters,
            isActive: true,
            createdByUserId: manager.id,
          },
        });
      });
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
