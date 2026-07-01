"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, LifeBuoy, Book, Mail } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6 p-2 md:p-6 max-w-4xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Support & Resources</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Get help with your integration or contact the FluxPay support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Book className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Explore our comprehensive API reference and integration guides.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Everything you need to know about building on top of FluxPay, from authentication to handling webhooks.
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Docs <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <LifeBuoy className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Help Center</CardTitle>
            <CardDescription>
              Find answers to common questions and troubleshooting tips.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Our knowledge base covers everything from account management to resolving payment disputes.
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Visit Help Center <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Mail className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Our team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Enterprise customers get priority 24/7 SLA support. Standard accounts receive responses within 24 hours.
          </CardContent>
          <CardFooter>
            <Button className="w-full sm:w-auto">Open Support Ticket</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
