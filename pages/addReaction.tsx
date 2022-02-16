import React from 'react'
import {
  graphql,
  usePreloadedQuery,
  useMutation,
  type PreloadedQuery,
} from 'react-relay'
import Button from '../components/Button'
import type { createIssueQuery } from './__generated__/createIssueQuery.graphql'
import { query } from './createIssue.page'
import {
  addReactionMutation,
  ReactionContent,
} from './__generated__/addReactionMutation.graphql'

interface Props {
  id: string
}

// Basic mutation example using Relay.
export const AddReaction: React.FC<Props> = ({ id }) => {
  const [commit, isInFlight] = useMutation<addReactionMutation>(graphql`
    mutation addReactionMutation($input: AddReactionInput!) {
      addReaction(input: $input) {
        clientMutationId
        reaction {
          content
        }
      }
    }
  `)

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title')
    const body = formData.get('body')

    commit({
      variables: {
        input: {
          subjectId: id,
          content: title as ReactionContent,
        },
      },
      onCompleted(res) {
        console.log('good')
      },
    })
  }

  return (
    <form onSubmit={onFormSubmit}>
      <div className="m-1">
        <label htmlFor="title-input">
          <select name="title" id="title-input">
            <option value="">--emoji--</option>
            <option value="THUMBS_UP">👍</option>
            <option value="THUMBS_DOWN">👎</option>
            <option value="LAUGH">😆</option>
            <option value="HOORAY">🎉</option>
            <option value="CONFUSED">😕</option>
            <option value="HEART">❤️</option>
            <option value="ROCKET">🚀</option>
            <option value="EYES">👀</option>
          </select>
        </label>
      </div>
      <Button type="submit" disabled={isInFlight}>
        {isInFlight ? 'Creating...' : 'Create'}
      </Button>
    </form>
  )
}

export const SVG = () => {
  return (
    <svg
      height="18"
      aria-hidden="true"
      viewBox="0 0 16 16"
      version="1.1"
      width="18"
      data-view-component="true"
      className="octicon octicon-smiley social-button-emoji"
    >
      <path
        fill-rule="evenodd"
        d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z"
      ></path>
    </svg>
  )
}
