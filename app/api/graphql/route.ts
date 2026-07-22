import { createYoga } from "graphql-yoga";
import { schema } from "@/graphql/schema";
import { createContext } from "@/graphql/context";

const { handleRequest } = createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: "/api/graphql",
});

export async function GET(request: Request) {
  return handleRequest(request, {});
}

export async function POST(request: Request) {
  return handleRequest(request, {});
}
