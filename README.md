# beerWars

Aplicación destinada a clientes de una cerveceria con el fin de realizar competencias entre las mesas de la misma.
La app esta desarrollada en Ionic en conjunto con una API GraphQL creada utilizando Apollo.

Las pantallas de la aplicacion se encuentran en src/pages.

En la carpeta server se encuentra el archivo types.graphql, el cual contiene los distintos tipos que maneja
la aplicación y es a partir de este archivo que se genera la api de GraphQL.

Dentro de src/services están los servicios para mesas y clientes.

En app/graphql.ts podemos ver todas las consultas GraphQL utilizadas por la aplicación.
Las que llevan nombre QUERY solo obtienen datos.
Por otro lado, las que llevan nombre MUTATION generan cambios en la base de datos.
Por último, las SUBSCRIPTION se utilizan para obtener una notificación del servidor cuando hay un cambio en la base.
Un breve ejemplo:

export const UPDATE_USER_TABLE_SUBSCRIPTION = gql`
  subscription ($tableId: ID!){
    Table(filter: {
      node: {
        id: $tableId
      }
      mutation_in : [UPDATED]
    }) {
      node {
        id
        name
        beerCount
        users {
          id
          name
          beerCount
        }
      }
    }
  }
`;

En este caso el servidor nos avisará cuando la mesa con el id que le pasamos sufra una modificación (UPDATED).
Y nos enviará todos los datos dentro de "node".

Muy similar es la forma en la que funcionan las suscripciones con [CREATE] y [DELETE]

