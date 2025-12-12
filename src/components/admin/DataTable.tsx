import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onToggleActive?: (item: T) => void;
}

function DataTable<T extends { id: string; is_active?: boolean }>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        لا توجد عناصر. أنشئ عنصرك الأول للبدء.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column) => (
              <TableHead key={String(column.key)} className="font-semibold text-right">
                {column.header}
              </TableHead>
            ))}
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30">
              {columns.map((column) => (
                <TableCell key={`${item.id}-${String(column.key)}`}>
                  {column.render
                    ? column.render(item)
                    : String((item as Record<string, unknown>)[column.key as string] ?? '')}
                </TableCell>
              ))}
              <TableCell className="text-left">
                <div className="flex items-center justify-start gap-2">
                  {onToggleActive && 'is_active' in item && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleActive(item)}
                      title={item.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                    >
                      {item.is_active ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      title="تعديل"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item)}
                      className="text-destructive hover:text-destructive"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
