FROM golang:1.8

# Install dependecies
RUN go get github.com/graphql-go/graphql
RUN go get github.com/graphql-go/handler
RUN go get github.com/mnmtanish/go-graphiql
RUN go get github.com/rs/cors
RUN go get github.com/johnnadratowski/golang-neo4j-bolt-driver

# copy the local package file to the container workspace
ADD . /go/src/graphql-server

WORKDIR /go/src/graphql-server

RUN go install graphql-server

ENTRYPOINT /go/bin/graphql-server

EXPOSE 8080
