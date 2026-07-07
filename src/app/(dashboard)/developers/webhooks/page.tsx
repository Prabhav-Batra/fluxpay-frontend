"use client";

import { useEffect, useState } from "react";
import { Webhook, Trash2, ShieldAlert } from "lucide-react";
import { getWebhooks, deactivateWebhook, WebhookEndpointDto } from "@/lib/api/webhooks";
import { getMerchantId } from "@/lib/api/auth";
import { CreateWebhookDialog } from "@/components/webhooks/CreateWebhookDialog";
import { Button } from "@/components/ui/button";

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpointDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEndpoints = async () => {
    setIsLoading(true);
    try {
      const merchantId = getMerchantId();
      const data = await getWebhooks(merchantId);
      setEndpoints(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(fetchEndpoints, 0);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deactivateWebhook(id);
      fetchEndpoints();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <Webhook className="w-8 h-8 mr-3 text-primary" />
            Webhooks
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage endpoints to receive real-time updates about your payments and subscriptions.
          </p>
        </div>
        
        <CreateWebhookDialog onCreated={fetchEndpoints} />
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
        <div>
          <h3 className="text-amber-500 font-medium">Security Notice</h3>
          <p className="text-amber-500/80 text-sm mt-1">
            Always verify webhook signatures to ensure events actually originated from FluxPay.
            Your endpoint&apos;s signing secret is displayed below. Keep it safe.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center border border-border rounded-xl bg-card">
            <div className="animate-pulse text-muted-foreground">Loading endpoints...</div>
          </div>
        ) : endpoints.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-card">
            <Webhook className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No webhooks configured</h3>
            <p className="text-muted-foreground max-w-md text-center mb-6">
              Add a webhook endpoint to start receiving events about your products and assets.
            </p>
            <CreateWebhookDialog onCreated={fetchEndpoints} />
          </div>
        ) : (
          endpoints.map((endpoint) => (
            <div 
              key={endpoint.id} 
              className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/20"
            >
              <div className="p-6 flex flex-col sm:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <h3 className="text-lg font-medium text-foreground break-all">
                        {endpoint.url}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Added on {new Date(endpoint.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Signing Secret</label>
                    <div className="mt-1 font-mono text-sm bg-muted border border-border rounded-md p-2 text-primary break-all">
                      {endpoint.secretKey || "whsec_..."}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                    {(endpoint.events || ["payment.succeeded", "payment.failed"]).map((e) => (
                      <span key={e} className="px-2.5 py-1 rounded-full bg-muted border border-border text-xs font-medium text-foreground">
                        {e}
                      </span>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(endpoint.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 self-start sm:self-end"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
