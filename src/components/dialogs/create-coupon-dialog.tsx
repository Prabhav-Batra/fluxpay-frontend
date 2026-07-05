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
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  maxUses?: string;
  validUntil?: string;
};

export function CreateCouponDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      discountType: "PERCENTAGE",
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, string | number> = {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
        merchantId: getMerchantId(),
      };
      
      if (data.maxUses) {
        payload.maxUses = parseInt(data.maxUses, 10);
      }
      
      if (data.validUntil) {
        payload.validUntil = new Date(data.validUntil).toISOString();
      }
      
      await apiClient.post(`/coupons`, payload);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create coupon", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Coupon</DialogTitle>
          <DialogDescription>
            Create a new discount code for your customers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code <span className="text-destructive">*</span></Label>
            <Input 
              id="code" 
              placeholder="e.g. SUMMER50" 
              className="uppercase"
              {...register("code", { required: "Code is required" })} 
            />
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select defaultValue="PERCENTAGE" onValueChange={(val) => setValue("discountType", val as "PERCENTAGE" | "FIXED")}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discountValue">Value <span className="text-destructive">*</span></Label>
              <Input 
                id="discountValue" 
                type="number"
                step="0.01"
                min="0"
                placeholder="20" 
                {...register("discountValue", { required: "Value is required", min: 0 })} 
              />
              {errors.discountValue && <p className="text-xs text-destructive">{errors.discountValue.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses (Optional)</Label>
              <Input 
                id="maxUses" 
                type="number"
                min="1"
                placeholder="Unlimited" 
                {...register("maxUses")} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until (Optional)</Label>
              <Input 
                id="validUntil" 
                type="date"
                {...register("validUntil")} 
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
