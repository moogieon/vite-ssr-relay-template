import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  contents: string
}

const MarkDownRenderer: React.FC<Props> = ({ contents }) => {
  return (
    <div>
      <ReactMarkdown children={contents} remarkPlugins={[remarkGfm]} />
    </div>
  )
}
export default MarkDownRenderer