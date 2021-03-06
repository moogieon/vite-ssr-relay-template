import React from 'react'
import { graphql, useFragment } from 'react-relay'
import type { Issue_issue$key } from './__generated__/Issue_issue.graphql'

interface Props {
  repoOwner: string
  repoName: string
  issue: Issue_issue$key
}

// Simple component that renders the issue using GraphQL fragment.
const IssueComponent: React.FC<Props> = ({ issue, repoOwner, repoName }) => {
  const data = useFragment(
    graphql`
      fragment Issue_issue on Issue {
        title
        number
        author {
          login
        }

        createdAt
        url
      }
    `,
    issue
  )

  return (
    <div>
      <a
        href={`/repo/${repoOwner}/${repoName}/issues/${data.number}`}
        className="text-lg underline transition-colors hover:text-gray-500"
      >
        <h3>{data.title}</h3>
      </a>

      <p>{data.author?.login}</p>
      <p>{new Date(data.createdAt).toLocaleString()}</p>
    </div>
  )
}

export default IssueComponent
