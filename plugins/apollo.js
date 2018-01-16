import { ApolloLink } from "apollo-link"
import { BatchHttpLink } from "apollo-link-batch-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import * as consts from "../constants"

export default ctx => {
  const httpLink = new BatchHttpLink({ uri: "http://localhost:8000/gql/" })

  // auth token
  let token = process.server
    ? ctx.req.session
    : window.localStorage.getItem(consts.LOCAL_STORAGE_JWT_TOKEN)

  // middleware
  const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: `JWT ${token}`
      }
    })
    return forward(operation)
  })
  const link = middlewareLink.concat(httpLink)

  return {
    link,
    cache: new InMemoryCache()
  }
}
