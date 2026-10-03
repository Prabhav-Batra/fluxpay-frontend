'use client';

import { PageHeader } from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ApiKeysPanel } from './ApiKeysPanel';
import { EventsPanel } from './EventsPanel';
import { QuickStartPanel } from './QuickStartPanel';
import { WebhookEndpointsPanel } from './WebhookEndpointsPanel';

/** Developers screen: API keys, webhooks, events and quick start. */
export function DevelopersPage() {
  return (
    <>
      <PageHeader title="Developers" description="Connect your backend to FluxPay." />
      <Tabs defaultValue="keys">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="keys">API keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="quickstart">Quick start</TabsTrigger>
        </TabsList>
        <TabsContent value="keys">
          <ApiKeysPanel />
        </TabsContent>
        <TabsContent value="webhooks">
          <WebhookEndpointsPanel />
        </TabsContent>
        <TabsContent value="events">
          <EventsPanel />
        </TabsContent>
        <TabsContent value="quickstart">
          <QuickStartPanel />
        </TabsContent>
      </Tabs>
    </>
  );
}
