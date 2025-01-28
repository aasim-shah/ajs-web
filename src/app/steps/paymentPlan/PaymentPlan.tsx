"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRegCircleCheck } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi"; 
import { AppDispatch, RootState } from "@/store";
import { fetchCompanyPlans, upgradeCompanySubscription } from "@/store/slices/companyPlansSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type Plan = {
  name: string;
  price: string;
  features: string[];
  unavailableFeatures?: string[];
  buttonVariant: "default" | "outline" | "link" | "destructive" | "secondary" | "ghost" | null | undefined;
  bgColor: string;
  textColor: string;
  buttonClass: string;
  extraClass: string;
};

const PaymentPlan: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { plans: fetchedPlans, status, upgradeStatus } = useSelector((state: RootState) => state.companyPlans);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast(); 

  useEffect(() => {
    dispatch(fetchCompanyPlans());
  }, [dispatch]);

  useEffect(() => {
    if (fetchedPlans.length > 0) {
      const reversedPlans = [...fetchedPlans].reverse(); // Reverse the fetched plans array
      const mappedPlans: Plan[] = reversedPlans.map((plan) => {
        let customStyles: Partial<Plan> = {};

        if (plan.name === "Premium") {
          customStyles = {
            bgColor: "bg-signature",
            textColor: "text-background",
            buttonClass: "bg-background text-signature",
            extraClass: "border-2 border-background transform translate-y-[-10px] scale-105 my-5 sm:my-0",
          };
        } else {
          customStyles = {
            bgColor: "bg-background",
            textColor: "text-signature",
            buttonClass: "",
            extraClass: "border-2 border-signature",
          };
        }

        return {
          name: plan.name,
          price: `£${(plan.price / 100).toFixed(2)}`,
          features: plan.features,
          unavailableFeatures: ["Expense Tracking", "Invoice Generate", "Purchase Generate", "Payroll", "App Management"],
          buttonVariant: "outline",
          bgColor: customStyles.bgColor || "bg-background", // Default value
          textColor: customStyles.textColor || "text-signature", // Default value
          buttonClass: customStyles.buttonClass || "", // Default value
          extraClass: customStyles.extraClass || "", // Default value
        };
      });

      setPlans(mappedPlans);
    }
  }, [fetchedPlans]);

  const handleUpgrade = () => {
    if (selectedPlan) {
      dispatch(upgradeCompanySubscription({ planName: selectedPlan }))
        .unwrap()
        .then(() => {
          toast({
            description: "Subscription upgraded successfully.",
            variant: "default",
          });
          setIsDialogOpen(false);
        })
        .catch((error) => {
          toast({
            description: error,
            variant: "destructive",
          });
        });
    }
  };

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-center md:text-3xl font-bold mb-4 text-signature">Choose Your Plan</h1>
      <p className="text-center text-lg text-signature/50 mb-8">
        Best Plans For <span className="text-signature">Office Management</span>
      </p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
        {status === "loading" ? (
          <p>Loading...</p>
        ) : (
          plans.map((plan, index) => (
            <Card
              key={index}
              className={`sm:max-w-md sm:px-6 sm:py-3 p-2 ${plan.bgColor} ${plan.extraClass}`}
            >
              <CardHeader>
                <CardTitle className={`text-center ${plan.textColor}`}>
                  <h1 className="border border-signature py-2 rounded-md">{plan.name}</h1>
                </CardTitle>
                <CardDescription className="text-center">
                  <span className={`block sm:text-3xl ${plan.textColor === "text-background" ? "text-background" : "text-signature"}`}>{plan.price}</span>
                  <span className="text-gray-300 text-md">User/Month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <FaRegCircleCheck className="mr-2 text-green-500 text-lg" />
                    <p className={plan.textColor}>{feature}</p>
                  </div>
                ))}
                {plan.unavailableFeatures?.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <GiCancel  className={`mr-2 text-lg ${plan.textColor ? "text-gray-300" : "text-gray-400"}`} />
                    <p className={`${plan.textColor ? "text-gray-300" : "text-muted-foreground"} line-through`}>{feature}</p>
                  </div>
                ))}
              </CardContent>
              <div className="pt-4">
                <Button
                  className={`w-full ${plan.buttonClass} hover:bg-background hover:text-signature`}
                  onClick={() => handlePlanSelection(plan.name)}
                >
                  Choose Plan
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background p-6 rounded-lg">
          <DialogHeader className="text-foreground">
            <DialogTitle>Confirm Plan Upgrade</DialogTitle>
          </DialogHeader>
          <p className="text-foreground">Are you sure you want to upgrade to the {selectedPlan} plan?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)} className="text-signature">
              Cancel
            </Button>
            <Button onClick={handleUpgrade} disabled={upgradeStatus === "loading"} className="bg-signature text-background">
              {upgradeStatus === "loading" ? "Upgrading..." : "Confirm Upgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-center mt-8">
        <Button className="w-2/4 px-8 py-6 text-xl">Continue</Button>
      </div>
    </div>
  );
};

export default PaymentPlan;
