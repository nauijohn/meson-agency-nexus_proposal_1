/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from "react";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginatedResponse } from "@/services/base.type";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function TableData<T>({
  data,
  columns,
  filterBy,
  paginationMeta,
  hoverContent,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  filterBy?: string;
  paginationMeta?: Partial<Omit<PaginatedResponse<T>, "items">> & {
    setPage?: (page: number) => void;
  };
  hoverContent?: React.ReactNode;
}) {
  // const [currIndexPage, setCurrIndexPage] = React.useState(0);
  // const currPage = React.useRef<HTMLAnchorElement>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize: data.length,
        pageIndex: 0,
      },
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        {filterBy && (
          <Input
            placeholder="Filter emails..."
            value={
              (table.getColumn(filterBy)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterBy)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-md">
        <Table className="border rounded-md overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const tableRowComp = (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
                if (!hoverContent) return tableRowComp;

                return (
                  <HoverCard key={row.id}>
                    <HoverCardTrigger asChild>{tableRowComp}</HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      {hoverContent}
                    </HoverCardContent>
                  </HoverCard>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!(paginationMeta?.totalPages === 1) && (
        <Pagination>
          <PaginationContent>
            {/** Previous Page */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (!paginationMeta) return;
                  if (!paginationMeta.hasPrevPage) return;
                  if (paginationMeta.setPage && paginationMeta.page) {
                    paginationMeta.setPage(paginationMeta.page - 1);
                  }
                  // if (table.getState().pagination.pageIndex === 0) return;
                  // setCurrIndexPage(table.getState().pagination.pageIndex - 1);
                  // table.previousPage();
                }}
              />
            </PaginationItem>
            {/** Current Page */}

            <PaginationItem>
              <PaginationLink>
                {`${paginationMeta?.page} / ${paginationMeta?.totalPages}`}
              </PaginationLink>
            </PaginationItem>

            {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}

            {/** Next Page */}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (!paginationMeta) return;
                  if (!paginationMeta.hasNextPage) return;
                  if (paginationMeta.setPage && paginationMeta.page) {
                    paginationMeta.setPage(paginationMeta.page + 1);
                  }
                  // const currentPage = table.getState().pagination.pageIndex + 1;
                  // const lastPage = table.getPageCount();
                  // if (currentPage === lastPage) return;
                  // setCurrIndexPage(currentPage);
                  // table.nextPage();
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {/* <div className="flex justify-between items-center pt-4">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div> */}
    </div>
  );
}
