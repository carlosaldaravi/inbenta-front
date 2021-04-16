export const config = {
  // headers: {
  //   Authorization: "Bearer " + localStorage.getItem("user-token"),
  // },
  // apiURL: "http://localhost/inbenta/public/api/api.php",
  graphqlURL: "https://inbenta-graphql-swapi-prod.herokuapp.com/api",
  apiURL: "https://inbenta-api.herokuapp.com/api/api.php",
  network: {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
  },
};
