package main

import (
  "log"
  "net/http"
  "github.com/rs/cors"
  "github.com/graphql-go/graphql"
  "github.com/graphql-go/handler"
  "github.com/mnmtanish/go-graphiql"
  driver "github.com/johnnadratowski/golang-neo4j-bolt-driver"
)

type Person struct {
  ID int64 `json:"id"`
  Name string `json:"name"`
  From string `json:"from"`
}

// var People []Person

func getPeople() []Person {
  // Neo4j
  db, err := driver.NewDriver().OpenNeo("bolt://neo4j:neo4j2@neo4j:7687")

  if err != nil {
    log.Println("error connecting to neo4j:", err)
  }

  defer db.Close()

  cypher := `
  MATCH
    (n:Person)
  RETURN
    ID(n) as id, n.name as name, n.from as from
  LIMIT {limit}`

  data, _, _, err := db.QueryNeoAll(cypher, map[string]interface {}{ "limit": 25})

  if err != nil {
    log.Println("error querying person:", err)
    // w.WriteHeader(500)
    // w.Write([]byte("an error occured querying the DB"))
    // return
  } else if len(data) == 0 {
    // w.WriteHeader(404)
    // return
  }

  results := make([]Person, len(data))

  for idx, row := range data {
    results[idx] =
      Person{
        ID:    row[0].(int64),
        Name:  row[1].(string),
        From:  row[2].(string),
      }
  }

  return results

}

func addPerson(name string) Person {
  // Neo4j
  db, err := driver.NewDriver().OpenNeo("bolt://neo4j:neo4j2@neo4j:7687")

  if err != nil {
    log.Println("error connecting to neo4j:", err)
  }

  defer db.Close()

  cypher := `
  CREATE
    (n:Person {name: {name}, from:"graphql-server"})
  RETURN
    ID(n) as id, n.name as name, n.from as from`

  data, _, _, err := db.QueryNeoAll(cypher, map[string]interface {}{ "name": name})

  if err != nil {
    log.Println("error querying person:", err)
  } else if len(data) == 0 {
    log.Println("Non found")
  }

  return Person{
    ID:    data[0][0].(int64),
    Name:  data[0][1].(string),
    From:  data[0][2].(string),
  }

}

var personType = graphql.NewObject(
  graphql.ObjectConfig{
    Name: "Person",
    Fields: graphql.Fields {
      "id" : &graphql.Field {
        Type: graphql.Int,
      },
      "name": &graphql.Field {
        Type: graphql.String,
      },
      "from": &graphql.Field {
        Type: graphql.String,
      },
    },
  },
)

var queryType = graphql.NewObject(graphql.ObjectConfig{
  Name: "Query",
  Fields: graphql.Fields{
    "People": &graphql.Field{
      Type: graphql.NewList(personType),
      Description: "List of people",
      Resolve: func(p graphql.ResolveParams) (interface{}, error) {
        // People = getPeople()
        return getPeople(), nil
      },
    },
  },
})

var rootMutation = graphql.NewObject(graphql.ObjectConfig{
  Name: "RootMutation",
  Fields: graphql.Fields{
    "createPerson" : &graphql.Field{
      Type: personType,
      Description: "Create a person",
      Args: graphql.FieldConfigArgument{
        "name": &graphql.ArgumentConfig{
          Type: graphql.NewNonNull(graphql.String),
        },
      },
      Resolve: func(p graphql.ResolveParams) (interface{}, error){
        name, _ := p.Args["name"].(string)
        newPerson := addPerson(name)
        return newPerson, nil
      },
    },
  },
})

var Schema, _ = graphql.NewSchema(graphql.SchemaConfig{
  Query: queryType,
  Mutation: rootMutation,
})

func main() {

  c := cors.New(cors.Options{
    AllowedOrigins: []string{"*"},
  })

  h := handler.New(&handler.Config{
    Schema: &Schema,
    Pretty: true,
  })

  // serve HTTP
  serveMux := http.NewServeMux()
  // serveMux.HandleFunc("/neo", neo4jHandler)
  serveMux.Handle("/graphql", c.Handler(h))
  serveMux.HandleFunc("/graphiql", graphiql.ServeGraphiQL)

  http.ListenAndServe(":8080", serveMux)
}
