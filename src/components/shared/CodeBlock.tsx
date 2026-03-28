import { CheckCircle2 } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { type ReviewComment, type SubmissionFile } from '@/types'

interface CodeBlockProps {
  file: SubmissionFile
  comments?: ReviewComment[]
  onLineClick?: (lineNumber: number) => void
  highlightedLine?: number | null
  focusedLine?: number | null
}

export function CodeBlock({ file, comments = [], onLineClick, highlightedLine, focusedLine }: CodeBlockProps) {
  const commentLines = new Set(comments.filter((comment) => comment.file_id === file.id).map((comment) => comment.line_number))

  return (
    <ScrollArea className="h-[420px] rounded-2xl border border-border bg-[#0d1117] md:h-[520px] xl:h-[640px]">
      <SyntaxHighlighter
        language={file.language.toLowerCase()}
        style={oneDark}
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          background: 'transparent',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.85rem',
          minHeight: '100%',
        }}
        lineNumberStyle={(lineNumber) => ({
          minWidth: '2.5rem',
          paddingRight: '1rem',
          color: commentLines.has(lineNumber) ? '#60a5fa' : '#64748b',
          cursor: onLineClick ? 'pointer' : 'default',
        })}
        lineProps={(lineNumber) => ({
          onClick: () => onLineClick?.(lineNumber),
          onKeyDown: (event) => {
            if (!onLineClick) {
              return
            }

            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onLineClick(lineNumber)
            }
          },
          tabIndex: onLineClick ? 0 : -1,
          role: onLineClick ? 'button' : undefined,
          'aria-label': onLineClick ? `Select line ${lineNumber} for inline review` : undefined,
          className: cn(
            'group relative transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/80',
            onLineClick ? 'cursor-pointer' : '',
            highlightedLine === lineNumber ? 'bg-blue-500/10' : '',
            commentLines.has(lineNumber) ? 'bg-emerald-500/5' : '',
            focusedLine === lineNumber ? 'ring-1 ring-primary/70' : ''
          ),
        })}
      >
        {file.content}
      </SyntaxHighlighter>
      {highlightedLine ? (
        <div className="sticky bottom-4 ml-auto mr-4 mt-4 flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Commenting on line {highlightedLine}
        </div>
      ) : null}
    </ScrollArea>
  )
}
