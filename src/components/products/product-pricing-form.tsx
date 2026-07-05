import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/app/(dashboard)/products/builder/page";
import {
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
import { Separator } from "@/components/ui/separator";

interface ProductPricingFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ProductPricingForm({ form }: ProductPricingFormProps) {
  const currentProductType = form.watch("productType");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="productType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ONE_TIME">One-Time Purchase</SelectItem>
                <SelectItem value="SUBSCRIPTION">Subscription Plan</SelectItem>
                <SelectItem value="CREDIT_PACK">Credit / Token Pack</SelectItem>
                <SelectItem value="BUNDLE">Bundle (Multiple items)</SelectItem>
              </SelectContent>
            </Select>
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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} />
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
              <FormControl>
                <Input placeholder="INR" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {currentProductType === "SUBSCRIPTION" && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Cycle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cycle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trialPeriodDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trial Period (Days)</FormLabel>
                  <FormControl>
                    <Input placeholder="14" {...field} />
                  </FormControl>
                  <FormDescription>Leave blank for no trial.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      {currentProductType === "CREDIT_PACK" && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="baseCredits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Credits Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bonusCredits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bonus Credits (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
