'use client';
import { useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldItem,
} from '@hextech-ui/react/field';
import { Fieldset, FieldsetLegend, FieldsetDescription } from '@hextech-ui/react/fieldset';
import { CheckboxGroup } from '@hextech-ui/react/checkbox-group';
import { Checkbox } from '@hextech-ui/react/checkbox';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from '@hextech-ui/react/input-group';
import { ButtonGroup } from '@hextech-ui/react/button-group';
import { Button } from '@hextech-ui/react/button';

const schema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.'),
  roles: z.array(z.string()).min(1, 'Choose at least one role.'),
});
type Settings = z.infer<typeof schema>;
const roles = ['top', 'jungle', 'support'];

export default function PartySettingsDemo() {
  const descriptionId = useId();
  const [outcome, setOutcome] = useState('');
  const form = useForm<Settings>({
    resolver: zodResolver(schema),
    defaultValues: { name: 'The night shift', roles: ['support'] },
  });
  async function submit(values: Settings) {
    setOutcome('');
    await new Promise((resolve) => setTimeout(resolve, 700));
    setOutcome(`Saved locally: ${values.name} (${values.roles.join(', ')}).`);
  }
  return (
    <form
      aria-label="Party settings"
      noValidate
      onSubmit={form.handleSubmit(submit)}
      className="w-full max-w-sm"
    >
      <Fieldset disabled={form.formState.isSubmitting} aria-describedby={descriptionId}>
        <FieldsetLegend>Party settings</FieldsetLegend>
        <FieldsetDescription id={descriptionId}>
          These settings stay in this local example.
        </FieldsetDescription>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel>Party display name</FieldLabel>
                <InputGroup>
                  <InputGroupInput {...field} aria-invalid={fieldState.invalid} />
                  <InputGroupAddon>
                    <InputGroupText>#</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Use a short, recognizable name.</FieldDescription>
                {fieldState.error && <FieldError match>{fieldState.error.message}</FieldError>}
              </Field>
            )}
          />
          <Controller
            name="roles"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel nativeLabel={false}>Party roles</FieldLabel>
                <CheckboxGroup value={field.value} onValueChange={field.onChange} allValues={roles}>
                  <FieldItem>
                    <FieldLabel className="hx-checkbox-label">
                      <Checkbox parent /> Select all party roles
                    </FieldLabel>
                  </FieldItem>
                  {roles.map((role) => (
                    <FieldItem key={role}>
                      <FieldLabel className="hx-checkbox-label">
                        <Checkbox value={role} /> {role}
                      </FieldLabel>
                    </FieldItem>
                  ))}
                </CheckboxGroup>
                {fieldState.error && <FieldError match>{fieldState.error.message}</FieldError>}
              </Field>
            )}
          />
          <ButtonGroup aria-label="Party settings actions">
            <Button type="submit" variant="primary" loading={form.formState.isSubmitting}>
              Save party
            </Button>
            <Button
              type="button"
              onClick={() => {
                form.reset();
                setOutcome('');
              }}
            >
              Reset party
            </Button>
          </ButtonGroup>
          <p role="status" className="text-hx-sm text-hx-muted-foreground">
            {outcome}
          </p>
        </FieldGroup>
      </Fieldset>
    </form>
  );
}
