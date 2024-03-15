export const typeDefs = `#graphql
type Book {
  author: String
  title: String
}

type Query {
  books: [Book]
}`;