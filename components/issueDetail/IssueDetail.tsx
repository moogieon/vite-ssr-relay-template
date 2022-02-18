import React from 'react'
import { graphql, useFragment, usePaginationFragment } from 'react-relay'
import { IssueDetail_repository$key } from './__generated__/IssueDetail_repository.graphql'
import MarkDownRenderer from '../MarkDownRenderer'
import SuspenseImage from '../SuspenseImage'
import IssueCommentsListComponent from './issueComments/IssueCommentsList'
import { AddReaction } from '../../pages/addReaction'
import Reactions from './Reactions'
import { Reactions_query$key } from './__generated__/Reactions_query.graphql'
interface Props {
  repository: IssueDetail_repository$key
  query: Reactions_query$key
}

const IssueDetailComponent: React.FC<Props> = ({ repository, query }) => {
  const data = useFragment(
    graphql`
      fragment IssueDetail_repository on Repository {
        issue(number: $issueNumber) {
          body
          createdAt
          number
          title
          authorAssociation
          id
          author {
            login
            avatarUrl
          }
          ...Reactions_reactable
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
                alt={`${data.issue.author?.login}'s avatar`}
                src={data.issue.author?.avatarUrl}
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
                  <Reactions reactable={data.issue} query={query} />
                </div>
              </div>
              <MarkDownRenderer source={data.issue.body} />
            </div>
          </div>
          <IssueCommentsListComponent issue={data.issue} query={query} />
        </div>
      )}
    </>
  )
}
export default IssueDetailComponent
