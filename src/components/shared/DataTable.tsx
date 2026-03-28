import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface DataTableColumn<T> {
  key: string
  header: string
  accessor: (row: T) => string | number
  cell: (row: T) => ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: (row: T) => string | number
}

export function DataTable<T>({ columns, data, rowKey }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const sortedData = useMemo(() => {
    if (!sorting) {
      return data
    }

    const selectedColumn = columns.find((column) => column.key === sorting.key)
    if (!selectedColumn) {
      return data
    }

    return [...data].sort((left, right) => {
      const leftValue = selectedColumn.accessor(left)
      const rightValue = selectedColumn.accessor(right)
      const direction = sorting.direction === 'asc' ? 1 : -1

      if (leftValue < rightValue) {
        return -1 * direction
      }
      if (leftValue > rightValue) {
        return 1 * direction
      }
      return 0
    })
  }, [columns, data, sorting])

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 px-3 text-xs uppercase tracking-[0.2em] text-zinc-500 hover:bg-transparent hover:text-zinc-200"
                      onClick={() =>
                        setSorting((current) =>
                          current?.key === column.key
                            ? {
                                key: column.key,
                                direction: current.direction === 'asc' ? 'desc' : 'asc',
                              }
                            : { key: column.key, direction: 'asc' }
                        )
                      }
                    >
                      {column.header}
                      {sorting?.key === column.key ? (
                        sorting.direction === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
