import React, { Suspense, useTransition } from 'react'
import { graphql, useFragment, usePaginationFragment } from 'react-relay'
import Button from '../Button'
import IssueComponent from './Issue'
import type { IssueList_repository$key } from './__generated__/IssueList_repository.graphql'

interface Props {
  repository: IssueList_repository$key
}

// Component that renders the list of issues for the repository using Relay's `usePaginationFragment()`.
const IssueListComponent: React.FC<Props> = ({ repository }) => {
  const [isPending, startTransition] = useTransition()

  const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    graphql`
      fragment IssueList_repository on Repository
      @refetchable(queryName: "IssueListPaginationQuery") {
        owner {
          login
        }
        name
        issues(
          after: $cursor
          first: $first
          orderBy: { field: CREATED_AT, direction: DESC }
          filterBy: $filter
        ) @connection(key: "issuesPageQuery_issues") {
          edges {
            node {
              ...Issue_issue
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
    repository
  )

  const [onlyOpened, setOnlyOpened] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    onlyOpened != null &&
      refetch({ filter: { states: onlyOpened ? 'OPEN' : null } })
  }, [onlyOpened])

  return (
    <div className="py-4">
      <Button onClick={() => setOnlyOpened(!onlyOpened)}>
        Toggle opened filter: {onlyOpened ? 'ON' : 'OFF'}
      </Button>
      <ul className="list-disc">
        {(data.issues.edges ?? [])
          .map(
            (edge, i) =>
              edge?.node && (
                <li key={i} className="ml-4 my-2">
                  <Suspense fallback={'Issue loading...'}>
                    <IssueComponent
                      issue={edge.node}
                      repoOwner={data.owner.login}
                      repoName={data.name}
                    />
                  </Suspense>
                </li>
              )
          )
          .filter(Boolean)}
      </ul>
      {data.issues.pageInfo.hasNextPage && (
        <Button
          onClick={() => {
            startTransition(() => {
              loadNext(10)
            })
          }}
          disabled={isPending || isLoadingNext}
        >
          {isPending || isLoadingNext ? 'Loading....' : 'Load more'}
        </Button>
      )}
    </div>
  )
}

export default IssueListComponent
