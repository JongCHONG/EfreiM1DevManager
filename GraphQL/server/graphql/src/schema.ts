export const typeDefs = `#graphql
type AuthPayload {
  token: String!
  user: User!
}

type Book {
  author: String
  id: ID!
  title: String
}

type Mutation {
  addBook(author: String!, title: String!): Book!
  deleteBook(id: ID!): Book!
  login(email: String!, password: String!): AuthPayload
  modifyBook(author: String!, id: ID!, title: String!): Book!
  signUp(email: String!, password: String!): AuthPayload
}

type Query {
  bookById(id: ID!): Book
  books: [Book]
  me: User
}

type User {
  email: String!
  id: ID!
  password: String!
}`;