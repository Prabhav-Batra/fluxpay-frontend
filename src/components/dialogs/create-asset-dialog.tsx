"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  internalKey: z.string().min(2, "Key must be at least 2 characters"),
  description: z.string().optional(),
  assetType: z.enum(["INTEGER", "DECIMAL", "BOOLEAN", "STRING", "TIME_BASED", "CUSTOM"]),
  defaultValue: z.string().optional(),
  maxValue: z.string().optional(),
  deliveryMethod: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().optional(),
});

export function CreateAssetDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      internalKey: "",
      description: "",
      assetType: "INTEGER",
      defaultValue: "0",
      maxValue: "",
      deliveryMethod: "API",
      price: "",
      currency: "USD",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { price, currency, ...rest } = values;
      const metadata = price || currency ? { price, currency } : undefined;
      
      await apiClient.post("/assets", {
        ...rest,
        metadata,
        merchantId: getMerchantId(),
      });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create asset:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Asset
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Digital Asset</DialogTitle>
          <DialogDescription>
            Define a new digital asset (like Coins, Gems, XP) that can be attached to products.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jexcoins" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="internalKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Key</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. jexcoins_balance" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique key used for API delivery and tracking.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="assetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INTEGER">Integer (e.g. Coins, Lives)</SelectItem>
                      <SelectItem value="DECIMAL">Decimal (e.g. Storage space)</SelectItem>
                      <SelectItem value="BOOLEAN">Boolean (e.g. Creator Badge)</SelectItem>
                      <SelectItem value="STRING">String</SelectItem>
                      <SelectItem value="TIME_BASED">Time Based (e.g. Minutes)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the asset..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit">Create Asset</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
