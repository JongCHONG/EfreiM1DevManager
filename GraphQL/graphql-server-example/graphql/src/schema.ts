export const typeDefs = `#graphql
type Book {
  author: String
  id: ID!
  title: String
}

type Mutation {
  addBook(author: String!, title: String!): Book!
  deleteBook(id: ID!): Book!
  modifyBook(author: String!, id: ID!, title: String!): Book!
}

type Query {
  books: [Book]
}`;