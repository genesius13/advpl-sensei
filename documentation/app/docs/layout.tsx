import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        footer: (
          <div className="text-xs text-fd-muted-foreground text-center py-2 border-t">
            Criado por{' '}
            <a
              href="https://github.com/thalysjuvenal"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-fd-foreground hover:underline"
            >
              Thalys Augusto
            </a>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
