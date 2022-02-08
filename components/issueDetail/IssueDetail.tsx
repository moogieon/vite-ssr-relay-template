import React from 'react'
import { graphql, usePaginationFragment } from 'react-relay'
import { IssueDetail_repository$key } from './__generated__/IssueDetail_repository.graphql'
import MarkDownRenderer from '../MarkDownRenderer'
import IssueCommentsComponent from './issueComments/IssueComments'
import SuspenseImage from '../SuspenseImage'
import Button from '../Button'

interface Props {
  repository: IssueDetail_repository$key
}

const IssueDetailComponent: React.FC<Props> = ({ repository }) => {
  const { data, isLoadingNext, loadNext } = usePaginationFragment(
    graphql`
      fragment IssueDetail_repository on Repository
      @refetchable(queryName: "IssueDetailPaginationQuery") {
        issue(number: $issueNumber) {
          body
          createdAt
          number
          title
          author {
            login
            avatarUrl
          }
          comments(after: $cursor, first: $first)
            @connection(key: "issueDetail_comments") {
            edges {
              node {
                ...IssueComments_comment
              }
            }
            pageInfo {
              hasNextPage
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
        <div className="w-[80%]">
          <div className="text-2xl px-2 mb-10">
            {data.issue.title} <span> #{data.issue.number}</span>
          </div>
          <div className="flex">
            <SuspenseImage
              className="rounded-1/2 border w-20 h-20 mr-2"
              title={`${data.issue.author?.login}'s avatar`}
              src={data.issue.author?.avatarUrl as string}
            />
            <div className="flex flex-col border rounded-lg px-2 overflow-x-scroll w-[50%]">
              <div className=" flex items-center">
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
          </div>

          <ul className="pl-2">
            {(data.issue.comments.edges ?? []).map(
              (edge, i) =>
                edge?.node && (
                  <li key={i} className="my-10 pl-2">
                    <IssueCommentsComponent comment={edge?.node} />
                  </li>
                )
            )}
          </ul>
          {isLoadingNext
            ? 'Loading more...'
            : data.issue.comments.pageInfo.hasNextPage && (
                <Button onClick={() => loadNext(10)}>Load more</Button>
              )}
        </div>
      )}
    </>
  )
}
export default IssueDetailComponent
