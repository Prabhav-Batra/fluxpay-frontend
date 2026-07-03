"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Building2, AppWindow, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrganization, createApplication } from "@/lib/api/organization";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [orgName, setOrgName] = useState("");
  const [appName, setAppName] = useState("");
  const [orgId, setOrgId] = useState<string | null>(null);

  // We need merchantId from local storage
  const [merchantId, setMerchantId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("fluxpay_merchant_id");
      if (storedId) setMerchantId(storedId);
    }
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !merchantId) return;

    setIsLoading(true);
    try {
      const org = await createOrganization(orgName, merchantId);
      setOrgId(org.id);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !orgId) return;

    setIsLoading(true);
    try {
      const app = await createApplication(appName, orgId);
      
      // We should NOT overwrite fluxpay_merchant_id with app.id!
      // The merchant ID should remain the user's merchant ID.
      
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const finishOnboarding = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border z-0 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500 rounded-full" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />

          <StepIndicator currentStep={step} stepNum={1} icon={<Building2 className="w-5 h-5" />} label="Organization" />
          <StepIndicator currentStep={step} stepNum={2} icon={<AppWindow className="w-5 h-5" />} label="Application" />
          <StepIndicator currentStep={step} stepNum={3} icon={<CheckCircle2 className="w-5 h-5" />} label="Ready" />
        </div>

        {/* Step 1: Organization */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-3xl p-10 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create your Organization</h2>
            <p className="text-muted-foreground mb-8">This is the top-level container for all your apps and billing.</p>
            
            <form onSubmit={handleCreateOrg} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Organization Name</label>
                <Input 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme Corp" 
                  className="bg-background border-border text-foreground h-12 text-lg focus-visible:ring-primary"
                  autoFocus
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
                disabled={isLoading || !orgName}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: Application */}
        {step === 2 && (
          <div className="bg-card border border-border rounded-3xl p-10 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create your first App</h2>
            <p className="text-muted-foreground mb-8">An app represents a specific game or website where you'll sell products.</p>
            
            <form onSubmit={handleCreateApp} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Application Name</label>
                <Input 
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. My Awesome Game" 
                  className="bg-background border-border text-foreground h-12 text-lg focus-visible:ring-primary"
                  autoFocus
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
                disabled={isLoading || !appName}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create App"}
              </Button>
            </form>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="bg-card border border-border rounded-3xl p-10 shadow-xl text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">You're all set!</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Your organization and application are ready. You can now start creating digital assets and products.
            </p>
            <Button 
              onClick={finishOnboarding}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg group"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

function StepIndicator({ currentStep, stepNum, icon, label }: { currentStep: number, stepNum: number, icon: React.ReactNode, label: string }) {
  const isCompleted = currentStep > stepNum;
  const isCurrent = currentStep === stepNum;
  
  return (
    <div className="flex flex-col items-center relative z-10">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
        isCompleted 
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" 
          : isCurrent 
            ? "bg-background border-2 border-primary text-primary" 
            : "bg-background border border-border text-muted-foreground"
      }`}>
        {icon}
      </div>
      <span className={`absolute -bottom-8 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
        isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
      }`}>
        {label}
      </span>
    </div>
  );
}
