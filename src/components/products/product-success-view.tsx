import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProductSuccessViewProps {
  successData: Record<string, unknown>;
}

export function ProductSuccessView({ successData }: ProductSuccessViewProps) {
  const router = useRouter();

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
