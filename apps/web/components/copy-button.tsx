'use client';
import { registryInstallCommand } from '@/lib/site';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
export function InstallCommand({ command }: { command: string }) {
  return (
    <CodeBlock className="install-command" title="Terminal">
      <Pre>
        <code>
          <span className="line">{command}</span>
        </code>
      </Pre>
    </CodeBlock>
  );
}

export function RegistryInstallCommand({ name }: { name: string }) {
  return <InstallCommand command={registryInstallCommand(name)} />;
}
