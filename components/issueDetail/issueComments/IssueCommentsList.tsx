// import React, { Suspense, useTransition } from 'react'
// import { graphql, usePaginationFragment } from 'react-relay'
// import Button from '../../Button'
// import { Reactions_query$key } from '../__generated__/Reactions_query.graphql'
// import IssueCommentsComponent from './IssueComments'
// import { IssueCommentsList_issue$key } from './__generated__/IssueCommentsList_issue.graphql'

// interface Props {
//   issue: IssueCommentsList_issue$key
//   query: Reactions_query$key
// }

// const IssueCommentsListComponent: React.FC<Props> = ({ issue, query }) => {
//   const [isPending, startTransition] = useTransition()
//   const { data, isLoadingNext, loadNext } = usePaginationFragment(
//     graphql`
//       fragment IssueCommentsList_issue on Issue
//       @refetchable(queryName: "IssueCommentsListPaginationQuery") {
//         comments(after: $cursor, first: $first)
//           @connection(key: "issueDetail_comments") {
//           edges {
//             node {
//               ...IssueComments_comment
//             }
//           }
//           pageInfo {
//             hasNextPage
//           }
//         }
//       }
//     `,
//     issue
//   )

//   return (
//     <>
//       {data && (
//         <>
//           <ul className="pl-2">
//             {(data.comments.edges ?? []).map(
//               (edge, i) =>
//                 edge?.node && (
//                   <li key={i} className="my-10 pl-2">
//                     <Suspense fallback={null}>
//                       <IssueCommentsComponent comment={edge?.node} query={query} />
//                     </Suspense>
//                   </li>
//                 )
//             )}
//           </ul>
//           {data.comments.pageInfo.hasNextPage && (
//             <Button
//               onClick={() => {
//                 startTransition(() => {
//                   loadNext(10)
//                 })
//               }}
//               disabled={isPending || isLoadingNext}
//             >
//               {isPending || isLoadingNext ? 'Loading....' : 'Load more'}
//             </Button>
//           )}
//         </>
//       )}
//     </>
//   )
// }
// export default IssueCommentsListComponent
