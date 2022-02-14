import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  source: string
  renderers: Record<string, Components>
}

const MarkDownRenderer: React.FC<Props> = ({ source }) => {
  return (
    <div>
      <ReactMarkdown children={source} remarkPlugins={[remarkGfm]} />
    </div>
  )
}
export default MarkDownRenderer
