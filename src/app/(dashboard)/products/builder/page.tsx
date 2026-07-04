"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api/axios";
import { getMerchantId } from "@/lib/api/auth";
import { useAssets } from "@/lib/api/hooks";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  productType: z.enum(["SUBSCRIPTION", "CREDIT_PACK", "BUNDLE", "ONE_TIME"]),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Price must be a valid positive number"),
  currency: z.string().min(3).max(3),
  visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]),
  
  // Subscription Fields
  billingCycle: z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "LIFETIME"]).optional(),
  trialPeriodDays: z.string().optional(),
  
  // Credit Pack Fields
  baseCredits: z.string().optional(),
  bonusCredits: z.string().optional(),

  // Assets
  assets: z.array(z.object({
    assetId: z.string().min(1, "Asset ID is required"),
    quantity: z.string().min(1, "Quantity must be at least 1")
  })).optional()
});

export default function ProductBuilderPage() {
  const router = useRouter();
  const { data: availableAssets } = useAssets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<Record<string, unknown> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      productType: "ONE_TIME",
      price: "0",
      currency: "INR",
      visibility: "PUBLIC",
      assets: []
    },
  });

  const { fields: assetFields, append: appendAsset, remove: removeAsset } = useFieldArray({
    control: form.control,
    name: "assets"
  });

  const currentProductType = form.watch("productType");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        merchantId: getMerchantId(),
        trialPeriodDays: values.trialPeriodDays ? parseInt(values.trialPeriodDays) : null,
        baseCredits: values.baseCredits ? parseInt(values.baseCredits) : null,
        bonusCredits: values.bonusCredits ? parseInt(values.bonusCredits) : null,
        assets: values.assets?.map(a => ({
          assetId: a.assetId,
          quantity: parseInt(a.quantity)
        })) || []
      };

      const res = await apiClient.post("/products", payload);
      setSuccessData(res.data.data);
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl mx-auto">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-800">Product Created Successfully</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Your product &quot;{successData.name as string}&quot; is now live and ready to accept payments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-green-900 mb-1">Hosted Checkout URL</p>
              <div className="flex items-center space-x-2">
                <Input readOnly value={successData.hostedCheckoutUrl as string} className="bg-white" />
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(successData.hostedCheckoutUrl as string)}>
                  Copy
                </Button>
              </div>
            </div>
            <Button onClick={() => router.push("/products")} className="mt-4">
              Return to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Product Builder</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="general">1. General Info</TabsTrigger>
              <TabsTrigger value="pricing">2. Pricing & Type</TabsTrigger>
              <TabsTrigger value="assets">3. Digital Assets</TabsTrigger>
              <TabsTrigger value="settings">4. Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Give your product a name and describe what customers get.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. VIP Subscription, 500 Coins Pack" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the benefits and features..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Type & Pricing</CardTitle>
                  <CardDescription>Configure how this product is billed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attach Digital Assets</CardTitle>
                  <CardDescription>Configure which digital assets are granted when a customer purchases this product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assetFields.map((field, index) => (
                    <div key={field.id} className="flex items-end space-x-4 border p-4 rounded-md bg-muted/50">
                      <FormField
                        control={form.control}
                        name={`assets.${index}.assetId`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Select Asset</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an asset..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableAssets?.map((a: { id: string; name: string; internalKey: string }) => (
                                  <SelectItem key={a.id} value={a.id}>{a.name} ({a.internalKey})</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`assets.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="ghost" size="icon" type="button" onClick={() => removeAsset(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={() => appendAsset({ assetId: "", quantity: "1" })} className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" />
                    Attach New Asset
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visibility & Settings</CardTitle>
                  <CardDescription>Control how this product appears in your storefront.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Public Product</FormLabel>
                          <FormDescription>
                            Anyone with the link can view and purchase this product.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "PUBLIC"}
                            onCheckedChange={(checked) => field.onChange(checked ? "PUBLIC" : "PRIVATE")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Generating Checkout..." : "Publish Product"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
