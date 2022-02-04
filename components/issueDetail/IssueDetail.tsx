import React from 'react'
import { useFragment, graphql } from 'react-relay'
import { IssueDetail_repository$key } from './__generated__/IssueDetail_repository.graphql'
interface Props {
  repository: IssueDetail_repository$key
}

export const IssueDetailComponent: React.FC<Props> = ({ repository }) => {
  const data = useFragment(
    graphql`
      fragment IssueDetail_repository on Repository {
        issue(number: $issueNumber) {
          body
          createdAt
          number
          title
          author {
            login
          }
        }
      }
    `,
    repository
  )
  return (
    <div>
      <div className="flex flex-col">
        <span> Title: {data.issue.title}</span>
        <span> User: {data.issue.author.login}</span>
        <span> IssueNum: #{data.issue.number}</span>
        <span>CreateAt: {new Date(data.issue.createdAt).toLocaleString()}</span>
      </div>
      <span>Contents: {data.issue.body}</span>
    </div>
  )
}
