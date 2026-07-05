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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api/axios";
import { getMerchantId } from "@/lib/api/auth";

type FormData = {
  mode: "LIVE" | "TEST";
};

export function GenerateApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    handleSubmit,
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      mode: "TEST",
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        mode: data.mode,
        merchantId: getMerchantId(),
      };
      
      await apiClient.post(`/api-keys`, payload);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to generate API key", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Key
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate API Key</DialogTitle>
          <DialogDescription>
            Create a new API key for integrating with FluxPay.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="mode">Mode <span className="text-destructive">*</span></Label>
            <Select defaultValue="TEST" onValueChange={(val) => setValue("mode", val as "LIVE" | "TEST")}>
              <SelectTrigger>
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEST">Test (Sandbox)</SelectItem>
                <SelectItem value="LIVE">Live (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Generate Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
