"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/axios";

const TEMP_MERCHANT_ID = "00000000-0000-0000-0000-000000000000";

type FormData = {
  url: string;
};

export function CreateWebhookDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        url: data.url,
        merchantId: TEMP_MERCHANT_ID,
      };
      
      await apiClient.post(`/webhooks`, payload);
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create webhook", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Endpoint
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Webhook Endpoint</DialogTitle>
          <DialogDescription>
            Register a new webhook URL to receive events from FluxPay.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="url">Endpoint URL <span className="text-destructive">*</span></Label>
            <Input 
              id="url" 
              type="url"
              placeholder="https://api.example.com/webhooks" 
              {...register("url", { 
                required: "URL is required",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Must be a valid HTTP or HTTPS URL"
                }
              })} 
            />
            {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Endpoint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
