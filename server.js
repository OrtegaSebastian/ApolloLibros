  import express from "express";
  import { ApolloServer } from "apollo-server-express";
  import gql from "graphql-tag";

  const app = express();

  // Define your GraphQL schema
  const typeDefs = gql`
    type libro {
      titulo: String
      autor: String
    }

    type Query {
      libros: [libro]
    }

    type Mutation {
      agregaLibro(titulo: String, autor: String): libro
      actualizaLibro(titulo: String, autor: String, nuevoTitulo: String, nuevoAutor: String): libro
      eliminaLibro(titulo: String): String
    }
  `;

  // Define your resolvers
  const resolvers = {
    Query: {
      libros: () => libros,
    },
    Mutation: {
      agregaLibro: (_, args) => {
        const newlibro = {
          titulo: args.titulo,
          autor: args.autor,
        };
        libros.push(newlibro);
        return newlibro;
      },
      actualizaLibro: (_, args) => {
        const index = libros.findIndex(libro => libro.titulo === args.titulo);
        if (index === -1) return null;
        const updatedlibro = {
          titulo: args.nuevoTitulo,
          autor: args.nuevoAutor,
        };
        libros[index] = updatedlibro;
        return updatedlibro;
      },
      eliminaLibro: (_, args) => {
        const index = libros.findIndex(libro => libro.titulo === args.titulo);
        if (index === -1) return "Libro no encontrado";
        libros.splice(index, 1);
        return "Libro eliminado con éxito";
      },
    },
  };

  const libros = [
    {
      titulo: "Cincuenta sombras de Grey",
      autor: "E. L. James",
    },
    {
      titulo: "Padre Rico, Padre Pobre",
      autor: "Robert Kiyosaki y Sharon Lechter",
    },
  ];

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