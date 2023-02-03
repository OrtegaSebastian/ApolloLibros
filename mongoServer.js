import express from "express";
import { ApolloServer } from "apollo-server-express";
import gql from "graphql-tag";
import mongoose from "mongoose";

const app = express();

mongoose.connect("mongodb://localhost/booksDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

const Book = mongoose.model("Book", bookSchema);

// Define your GraphQL schema
const typeDefs = gql`
  type Libro {
    titulo: String
    autor: String
  }

  type Query {
    libros: [Libro]
  }

  type Mutation {
    agregarLibro(titulo: String, autor: String): Libro
    eliminarLibro(titulo: String): Libro
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    libros: async () => {
      return await Book.find();
    },
  },
  Mutation: {
    agregarLibro: async (_, args) => {
      const libro = new Book({
        titulo: args.titulo,
        autor: args.autor,
      });
      await libro.save();
      return libro;
    },
    eliminarLibro: async (_, args) => {
      const libro = await Book.findOneAndDelete({ titulo: args.titulo });
      return libro;
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

server.applyMiddleware({ app });

const PORT = 4000;

const startServer = async () => {
  await app.listen({ port: PORT }, () => {
    console.log(`🚀 Servidor listo para la acción en http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();