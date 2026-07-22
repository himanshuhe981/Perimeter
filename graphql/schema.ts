import { makeExecutableSchema } from "@graphql-tools/schema";
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

  type Query {
    me: User
  }
`;

const resolvers = {
  Query: {
    me: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => ctx.dbUser,
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
