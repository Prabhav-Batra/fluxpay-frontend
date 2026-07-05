"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Copy, CheckCircle2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
      
      const res = await apiClient.post(`/api-keys`, payload);
      setGeneratedKey(res.data.data.rawKey);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    } catch (error) {
      console.error("Failed to generate API key", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setGeneratedKey(null);
      setCopied(false);
      reset();
    }, 200); // Wait for dialog close animation
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DialogTrigger render={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Key
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        {generatedKey ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-600 gap-2">
                <CheckCircle2 className="h-5 w-5" />
                API Key Generated
              </DialogTitle>
              <DialogDescription className="text-amber-600 font-medium">
                Please copy this key and store it somewhere safe. For security reasons, you will not be able to see it again!
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
               <div className="flex items-center space-x-2">
                 <Input readOnly value={generatedKey} className="bg-muted font-mono text-sm" />
                 <Button variant="secondary" onClick={handleCopy} className="w-24">
                   {copied ? "Copied!" : (
                     <>
                       <Copy className="mr-2 h-4 w-4" />
                       Copy
                     </>
                   )}
                 </Button>
               </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
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
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Generating..." : "Generate Key"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
