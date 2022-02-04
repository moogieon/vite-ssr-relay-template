import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { IssueDetailComponent } from '../components/issueDetail/IssueDetail'
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
  $issueNumber: Number
}
export const getQueryVariables: GetQueryVariables<
  RouteParams,
  issueDetailPageQueryVariables
> = (routeParams) => ({
  ...routeParams,
})
export const query = graphql`
  query issueDetailPageQuery(
    $owner: String!
    $name: String!
    $issueNumber: Int!
  ) {
    repository(name: $name, owner: $owner) {
      ...IssueDetail_repository
    }
  }
`

export const Page: React.FC<Props> = ({ queryRef }) => {
  const data = usePreloadedQuery<issueDetailPageQuery>(query, queryRef)

  return (
    <>
      <IssueDetailComponent repository={data.repository} />
    </>
  )
}
