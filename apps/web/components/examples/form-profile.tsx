'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@hextech-ui/react/button';
import { Field, FieldLabel, FieldDescription, FieldError } from '@hextech-ui/react/field';
import { Input } from '@hextech-ui/react/input';
import { Alert, AlertTitle, AlertDescription } from '@hextech-ui/react/alert';

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Use at least 2 characters.')
    .max(32, 'Use at most 32 characters.'),
});
type Profile = z.infer<typeof profileSchema>;

export default function FormProfileExample() {
  const [saved, setSaved] = useState(false);
  const form = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: '' },
  });
  async function submit(values: Profile) {
    setSaved(false);
    form.clearErrors('root');
    // Simulated request; "taken" exercises a server-side validation error locally.
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (values.displayName.toLowerCase() === 'taken') {
      form.setError(
        'displayName',
        { type: 'server', message: 'This display name is already taken.' },
        { shouldFocus: true },
      );
      return;
    }
    setSaved(true);
  }
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(submit)}
      aria-label="Profile form"
      className="grid w-full max-w-sm gap-5"
    >
      <Controller
        name="displayName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            name={field.name}
            invalid={fieldState.invalid}
            dirty={fieldState.isDirty}
            touched={fieldState.isTouched}
          >
            <FieldLabel>Display name</FieldLabel>
            <Input
              {...field}
              onChange={(event) => {
                field.onChange(event);
                setSaved(false);
              }}
              aria-invalid={fieldState.invalid}
              autoComplete="nickname"
              readOnly={form.formState.isSubmitting}
            />
            <FieldDescription>
              2–32 characters. Try “taken” to simulate a server error.
            </FieldDescription>
            {fieldState.error && <FieldError match>{fieldState.error.message}</FieldError>}
          </Field>
        )}
      />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" loading={form.formState.isSubmitting}>
          Save profile
        </Button>
        <Button
          type="button"
          disabled={form.formState.isSubmitting}
          onClick={() => {
            form.reset();
            setSaved(false);
          }}
        >
          Reset profile
        </Button>
      </div>
      <div role="status">
        {saved && (
          <Alert tone="success">
            <AlertTitle>Profile saved locally</AlertTitle>
            <AlertDescription>No account or backend is connected to this demo.</AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
}
