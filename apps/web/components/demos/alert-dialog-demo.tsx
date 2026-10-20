'use client';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
} from '@hextech-ui/react/alert-dialog';

export function AlertDialogDemo() {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>Leave party</AlertDialogTrigger>
        <AlertDialogContent showCloseButton>
          <AlertDialogTitle>Leave this party?</AlertDialogTitle>
          <AlertDialogDescription>This is a local demo action.</AlertDialogDescription>
          <AlertDialogClose>Stay</AlertDialogClose>
          <AlertDialogClose>Leave party</AlertDialogClose>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
