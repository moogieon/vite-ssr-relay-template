import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import IssueDetailComponent from '../components/issueDetail/IssueDetail'
import { GetQueryVariables } from '../renderer/types'

import type {
  issueDetailPageQuery,
  issueDetailPageQueryVariables,
} from './__generated__/issueDetailPageQuery.graphql'

interface Props {
  queryRef: PreloadedQuery<issueDetailPageQuery>
}
interface RouteParams {
  owner: string
  name: string
  issueNumber: string
}
export const getQueryVariables: GetQueryVariables<
  RouteParams,
  issueDetailPageQueryVariables
> = (routeParams) => ({
  ...routeParams,
  issueNumber: parseInt(routeParams.issueNumber),
  first: 10,
})

export const query = graphql`
  query issueDetailPageQuery(
    $owner: String!
    $name: String!
    $issueNumber: Int!
    $first: Int!
    $cursor: String
  ) {
    repository(name: $name, owner: $owner) {
      ...IssueDetail_repository
    }
    ...Reactions_query
  }
`

export const Page: React.FC<Props> = ({ queryRef }) => {
  const data = usePreloadedQuery<issueDetailPageQuery>(query, queryRef)

  return (
    <>
      {data.repository && (
        <React.Suspense fallback="Loading...">
          <IssueDetailComponent repository={data.repository} query={data} />
        </React.Suspense>
      )}
    </>
  )
}
