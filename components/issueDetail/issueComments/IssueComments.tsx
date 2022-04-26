// import React from 'react'
// import { useFragment, graphql } from 'react-relay'
// import MarkDownRenderer from '../../MarkDownRenderer'
// import SuspenseImage from '../../SuspenseImage'
// import Reactions from '../Reactions'
// import { Reactions_query$key } from '../__generated__/Reactions_query.graphql'
// import { IssueComments_comment$key } from './__generated__/IssueComments_comment.graphql'

// interface Props {
//   comment: IssueComments_comment$key
//   query: Reactions_query$key
// }

// const IssueCommentsComponent: React.FC<Props> = ({ comment, query }) => {
//   const data = useFragment(
//     graphql`
//       fragment IssueComments_comment on Comment {
//         body
//         author {
//           avatarUrl
//           login
//         }
//         createdAt
//         authorAssociation
//         ...Reactions_reactable
//       }
//     `,
//     comment
//   )
//   return (
//     <>
//       <div className="flex">
//         {typeof window !== 'undefined' ? (
//           <SuspenseImage
//             className="rounded-1/2 border w-20 h-20 mr-2"
//             title={`${data.author?.login}'s avatar`}
//             src={data.author?.avatarUrl as string}
//           />
//         ) : (
//           <div />
//         )}
//         <div className="rounded-lg  border px-2 w-[80%] overflow-x-auto">
//           <div className="flex items-center">
//             <div className="font-extrabold ">
//               {data.author?.login}
//               <span className="px-2 text-gray-500">
//                 {new Date(data.createdAt).toLocaleString()}
//               </span>
//               <span className="border rounded-lg text-sm">
//                 {data.authorAssociation}
//               </span>
//             </div>
//           </div>
//           <MarkDownRenderer source={data.body} />
//           <Reactions reactable={data} query={query} />
//         </div>
//       </div>
//     </>
//   )
// }
// export default IssueCommentsComponent
