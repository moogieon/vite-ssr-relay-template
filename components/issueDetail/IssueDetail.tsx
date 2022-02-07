import React from 'react'
import { useFragment, graphql } from 'react-relay'
import { IssueDetail_repository$key } from './__generated__/IssueDetail_repository.graphql'
import MarkDownRenderer from '../MarkDownRenderer'
import IssueCommentsComponent from './issueComments/IssueComments'

interface Props {
  repository: IssueDetail_repository$key
}

const IssueDetailComponent: React.FC<Props> = ({ repository }) => {
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
            ... on User {
              email
              avatarUrl
            }
          }
          comments(first: 10) {
            edges {
              node {
                ...IssueComments_comment
              }
            }
          }
        }
      }
    `,
    repository
  )

  return (
    <>
      {data.issue && (
        <div>
          <div className="text-2xl px-2">
            {data.issue.title} <span> #{data.issue.number}</span>
          </div>
          <div className="flex flex-col border px-2">
            <div className=" flex items-center">
              <img
                className="rounded-1/2 border w-20 h-20"
                src={data.issue.author?.avatarUrl}
              />
              <div className="font-extrabold">
                {data.issue.author?.login}
                <span className="text-gray-500 px-2">
                  {' '}
                  {new Date(data.issue.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <MarkDownRenderer contents={data.issue.body} />
          </div>
          <ul>
            {(data.issue.comments.edges ?? []).map(
              (edge, i) =>
                edge?.node && (
                  <li key={i} className="my-10 pl-2">
                    <IssueCommentsComponent comment={edge?.node} />
                  </li>
                )
            )}
          </ul>
        </div>
      )}
    </>
  )
}
export default IssueDetailComponent
