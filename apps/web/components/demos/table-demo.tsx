'use client';

import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@hextech-ui/react/table';

export function TableDemo() {
  return (
    <>
      <Table>
        <TableCaption>Local roster</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Avery</TableCell>
            <TableCell>Support</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
