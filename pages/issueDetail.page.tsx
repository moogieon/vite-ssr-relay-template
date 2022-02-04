import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { IssueDetailComponent } from '../components/issueDetail/IssueDetail'
import type { issueDetailPageQuery } from './__generated__/issueDetailPageQuery.graphql'

interface Props {
  queryRef: PreloadedQuery<issueDetailPageQuery>
}

interface RouteParams {
  issueNumber: Number
}

export const query = graphql`
  query issueDetailPageQuery($issueNumber: Int!) {
    repository(name: "vite-ssr-relay-template", owner: "moogieon") {
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
