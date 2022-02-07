import React from 'react'
import { useFragment, graphql } from 'react-relay'
import { IssueComments_comment$key } from './__generated__/IssueComments_comment.graphql'

interface Props {
  comment: IssueComments_comment$key
}

const IssueCommentsComponent: React.FC<Props> = ({ comment }) => {
  const data = useFragment(
    graphql`
      fragment IssueComments_comment on Comment {
        body
        author {
          ... on User {
            avatarUrl
          }
          login
        }
        createdAt
      }
    `,
    comment
  )
  return (
    <>
      <div className="rounded-lg  border px-2">
        <div className="flex items-center">
          <img className="rounded-1/2 w-20 h-20" src={data.author?.avatarUrl} />
          <div className='font-extrabold '>
            {data.author?.login}
            <span className="px-2 text-gray-500">
              {new Date(data.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        {data.body}
      </div>
    </>
  )
}
export default IssueCommentsComponent
