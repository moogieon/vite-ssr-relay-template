import { useFragment, graphql, useMutation } from 'react-relay'
import SuspenseImage from '../SuspenseImage'
import { ReactionsAddReactionMutation } from './__generated__/ReactionsAddReactionMutation.graphql'
import { ReactionsRemoveReactionMutation } from './__generated__/ReactionsRemoveReactionMutation.graphql'
import { Reactions_query$key } from './__generated__/Reactions_query.graphql'
import {
  ReactionContent,
  Reactions_reactable,
  Reactions_reactable$key,
} from './__generated__/Reactions_reactable.graphql'

interface Props {
  reactable: Reactions_reactable$key
  query: Reactions_query$key
}

const emojiMap = {
  THUMBS_UP: '👍',
  THUMBS_DOWN: '👎',
  ROCKET: '🚀',
  LAUGH: '😄',
  HOORAY: '🎉',
  HEART: '❤️',
  EYES: '👀',
  CONFUSED: '😕',
} as Record<ReactionContent, string>

const ReactionsComponent: React.FC<Props> = ({ reactable, query }) => {
  const { viewer } = useFragment(
    graphql`
      fragment Reactions_query on Query {
        viewer {
          __typename
          id
          avatarUrl
        }
      }
    `,
    query
  )
  const data = useFragment<Reactions_reactable$key>(
    graphql`
      fragment Reactions_reactable on Reactable {
        __typename
        id
        reactionGroups {
          content
          viewerHasReacted
          reactors(first: 10) {
            nodes {
              __typename
              ... on User {
                id
                avatarUrl
              }
            }
            totalCount
          }
        }
      }
    `,
    reactable
  )
  const [addReaction] = useMutation<ReactionsAddReactionMutation>(graphql`
    mutation ReactionsAddReactionMutation($input: AddReactionInput!) {
      addReaction(input: $input) {
        subject {
          ...Reactions_reactable
        }
      }
    }
  `)
  const [removeReaction] = useMutation<ReactionsRemoveReactionMutation>(graphql`
    mutation ReactionsRemoveReactionMutation($input: RemoveReactionInput!) {
      removeReaction(input: $input) {
        subject {
          ...Reactions_reactable
        }
      }
    }
  `)

  return (
    <ul className="flex">
      {data.reactionGroups
        ?.filter(({ reactors }) => reactors.totalCount > 0)
        .map((group) => (
          <li key={group.content}>
            <button
              className={
                'flex items-center border-2 rounded-full ' +
                (group.viewerHasReacted ? 'border-blue' : 'border-gray')
              }
              onClick={() => {
                if (!group.viewerHasReacted) {
                  addReaction({
                    variables: {
                      input: {
                        subjectId: data.id,
                        content: group.content,
                      },
                    },
                    optimisticResponse: {
                      addReaction: {
                        subject: {
                          ...data,
                          reactionGroups: data.reactionGroups?.map(
                            (optGroup) => ({
                              ...optGroup,
                              ...(optGroup === group
                                ? {
                                    viewerHasReacted: true,
                                    reactors: {
                                      nodes: [
                                        ...(optGroup.reactors.nodes ?? []),
                                        viewer,
                                      ],
                                      totalCount:
                                        optGroup.reactors.totalCount + 1,
                                    },
                                  }
                                : null),
                            })
                          ),
                        },
                      },
                    },
                  })
                } else {
                  removeReaction({
                    variables: {
                      input: {
                        subjectId: data.id,
                        content: group.content,
                      },
                    },
                    optimisticResponse: {
                      removeReaction: {
                        subject: {
                          ...data,
                          reactionGroups: data.reactionGroups?.map(
                            (optGroup) => ({
                              ...optGroup,
                              ...(optGroup === group
                                ? {
                                    viewerHasReacted: false,
                                    reactors: {
                                      nodes: optGroup.reactors.nodes?.filter(
                                        (node) =>
                                          node?.__typename === 'User'
                                            ? node.id !== viewer.id
                                            : true
                                      ),
                                      totalCount:
                                        optGroup.reactors.totalCount - 1,
                                    },
                                  }
                                : null),
                            })
                          ),
                        },
                      },
                    },
                  })
                }
              }}
            >
              <div className="mr-0.5">
                {emojiMap[group.content]} {group.reactors.totalCount}
              </div>
              {group.reactors.nodes
                ?.filter((r) => r?.avatarUrl)
                .map((reactor) => (
                  <SuspenseImage
                    className="w-4 h-4 rounded-full"
                    src={reactor!.avatarUrl!}
                    key={reactor!.avatarUrl!}
                  />
                ))}
            </button>
          </li>
        ))}
    </ul>
  )
}

export default ReactionsComponent
