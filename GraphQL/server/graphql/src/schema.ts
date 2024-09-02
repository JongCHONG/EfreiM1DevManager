export const typeDefs = `#graphql
type AuthPayload {
  token: String!
  user: User!
}

type Book {
  author: String
  id: ID!
  ownerEmail: String
  title: String
}

type Mutation {
  addBook(author: String!, ownerEmail: String!, title: String!): Book!
  deleteBook(id: ID!): Book!
  login(email: String!, password: String!): User!
  modifyBook(author: String!, id: ID!, title: String!): Book!
  signUp(email: String!, password: String!): User!
}

type Query {
  bookById(id: ID!): Book
  books: [Book]
}

type User {
  email: String!
  password: String!
}`;