import { FileCode2, UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { type SubmissionFile } from '@/types'

const acceptedExtensions = ['.js', '.ts', '.py', '.java', '.go', '.rs', '.cpp']

interface FileUploadZoneProps {
  files: SubmissionFile[]
  onChange: (files: SubmissionFile[]) => void
}

async function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Unable to read file.'))
    reader.readAsText(file)
  })
}

function guessLanguage(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase()
  if (!extension) return 'text'
  if (extension === 'ts') return 'typescript'
  if (extension === 'js') return 'javascript'
  if (extension === 'py') return 'python'
  if (extension === 'rs') return 'rust'
  if (extension === 'cpp') return 'cpp'
  return extension
}

export function FileUploadZone({ files, onChange }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [filename, setFilename] = useState('snippet.ts')
  const [pastedCode, setPastedCode] = useState('')

  async function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return

    const nextFiles = [...files]
    for (const file of Array.from(selectedFiles)) {
      if (nextFiles.length >= 10) break
      const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
      if (!acceptedExtensions.includes(extension) || file.size > 5 * 1024 * 1024) {
        continue
      }

      nextFiles.push({
        id: Date.now() + Math.random(),
        filename: file.name,
        language: guessLanguage(file.name),
        content: await readFile(file),
      })
    }
    onChange(nextFiles)
  }

  function addPastedCode() {
    if (!pastedCode.trim()) return
    onChange([
      ...files,
      {
        id: Date.now() + Math.random(),
        filename,
        language: guessLanguage(filename),
        content: pastedCode,
      },
    ])
    setPastedCode('')
  }

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          'border-dashed transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-border bg-background/40'
        )}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={async (event) => {
          event.preventDefault()
          setDragging(false)
          await handleFiles(event.dataTransfer.files)
        }}
      >
        <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-2xl border border-border bg-mutedSurface p-4">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Drag code files here</p>
            <p className="text-sm text-zinc-400">
              Supports {acceptedExtensions.join(' ')} with up to 10 files and 5MB each.
            </p>
          </div>
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            Select files
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptedExtensions.join(',')}
            className="hidden"
            onChange={(event) => void handleFiles(event.target.files)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold">Paste code directly</p>
              <p className="text-sm text-zinc-400">Useful for snippets or fast manual input.</p>
            </div>
            <div className="w-48">
              <input
                value={filename}
                onChange={(event) => setFilename(event.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-mutedSurface px-3 text-sm"
              />
            </div>
          </div>
          <Textarea
            value={pastedCode}
            onChange={(event) => setPastedCode(event.target.value)}
            placeholder="Paste code here..."
            className="min-h-[180px] font-mono"
          />
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={addPastedCode}>
              Add pasted code
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-2xl border border-border bg-mutedSurface/50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <FileCode2 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-zinc-100">{file.filename}</p>
                <p className="text-xs text-zinc-500">{file.language}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(files.filter((item) => item.id !== file.id))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

