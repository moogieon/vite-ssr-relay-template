import React from 'react'
import { graphql, useFragment, usePaginationFragment } from 'react-relay'
import { IssueDetail_repository$key } from './__generated__/IssueDetail_repository.graphql'
import MarkDownRenderer from '../MarkDownRenderer'
import SuspenseImage from '../SuspenseImage'
import Button from '../Button'
import IssueCommentsListComponent from './issueComments/IssueCommentsList'

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
          authorAssociation
          author {
            login
            avatarUrl
          }
          ...IssueCommentsList_issue
        }
      }
    `,
    repository
  )

  return (
    <>
      {data.issue && (
        <div className="container]">
          <div className="text-2xl px-2 mb-10">
            {data.issue.title} <span> #{data.issue.number}</span>
          </div>
          <div className="flex">
            {typeof window !== 'undefined' ? (
              <SuspenseImage
                className="rounded-1/2 border w-20 h-20 mr-2"
                title={`${data.issue.author?.login}'s avatar`}
                src={data.issue.author?.avatarUrl as string}
              />
            ) : (
              <div />
            )}

            <div className="flex flex-col border rounded-lg px-2 overflow-x-scroll w-[80%]">
              <div className=" flex items-center">
                <div className="font-extrabold">
                  {data.issue.author?.login}
                  <span className="text-gray-500 px-2">
                    {' '}
                    {new Date(data.issue.createdAt).toLocaleString()}
                  </span>
                  <span className="border rounded-lg text-sm">
                    {data.issue.authorAssociation}
                  </span>
                </div>
              </div>
              <MarkDownRenderer contents={data.issue.body} />
            </div>
          </div>
          <IssueCommentsListComponent issue={data.issue} />
          {/* <ul className="pl-2">
            {(data.issue.comments.edges ?? []).map(
              (edge, i) =>
                edge?.node && (
                  <li key={i} className="my-10 pl-2">
                    <IssueCommentsComponent comment={edge?.node} />
                  </li>
                )
            )}
          </ul> */}
        </div>
      )}
    </>
  )
}
export default IssueDetailComponent
