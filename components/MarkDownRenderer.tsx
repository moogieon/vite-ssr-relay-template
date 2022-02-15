import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SuspenseImage from './SuspenseImage'

interface Props {
  source: string
}

const MarkDownRenderer: React.FC<Props> = ({ source }) => {
  return (
    <div>
      <ReactMarkdown
        children={source}
        remarkPlugins={[remarkGfm]}
        components={{ img: SuspenseImage }}
      />
    </div>
  )
}
export default MarkDownRenderer
