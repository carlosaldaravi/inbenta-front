/**
 * @returns {string}
 */
export const getFilmsQuery = () => {
  let query = {
    query: `{
            allFilms(first: 10) {
                films {
                    title
                }
            totalCount
            }
        }`,
  };
  return query;
};
/**
 * @returns {string}
 */
export const getCharactersQuery = () => {
  let query = {
    query: `{
            allPeople(first: 10) {
              people {
               name
             }
             totalCount
            }
        }`,
  };
  return query;
};
