"use client";

import { useState } from "react";
import { Loader2, Webhook, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getMerchantId } from "@/lib/api/auth";
import { createWebhook } from "@/lib/api/webhooks";

interface CreateWebhookDialogProps {
  onCreated: () => void;
}

export function CreateWebhookDialog({ onCreated }: CreateWebhookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      const merchantId = getMerchantId();
      await createWebhook(merchantId, url, ["PAYMENT_SUCCESS", "SUBSCRIPTION_CREATED"]);
      setOpen(false);
      setUrl("");
      onCreated();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Endpoint
          </Button>
        } 
      />
      <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Webhook className="w-5 h-5 mr-2 text-primary" />
              Add Webhook Endpoint
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Receive real-time HTTP requests to your server when events happen.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Endpoint URL</label>
              <Input
                placeholder="https://api.yourapp.com/webhooks"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-background border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-foreground">Events to send</label>
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm text-primary">
                For this beta, all supported events will be sent to this endpoint automatically.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !url}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Endpoint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
