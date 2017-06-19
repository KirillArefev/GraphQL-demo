const schema = `
type Person {
    firstName: String
    lastName: String
    email: String
    username: String
    id: String
    friends: [Person]
}

type Query {
    person(id: ID!): Person
}

type schema {
    query: Query
}
`;

export default schema;