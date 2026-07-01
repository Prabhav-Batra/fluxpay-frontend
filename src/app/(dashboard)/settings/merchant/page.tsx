"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function MerchantSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-2 md:p-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Merchant Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your business profile, public details, and branding.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>
              These details will be displayed on customer receipts and invoices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" defaultValue="FluxPay Inc." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" defaultValue="support@fluxpay.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input id="support-phone" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-address">Business Address</Label>
              <Input id="business-address" defaultValue="123 Financial District, NY 10004" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save Profile</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>
              Customize your checkout experience and hosted pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-color">Brand Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input id="brand-color" type="color" defaultValue="#0f172a" className="w-16 h-10 p-1" />
                <Input defaultValue="#0f172a" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Brand Logo</Label>
              <Input id="logo" type="file" accept="image/*" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Update Branding</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
