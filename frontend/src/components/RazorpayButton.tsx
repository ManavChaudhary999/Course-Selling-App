import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { createCheckoutSessionRequest, verifyPaymentRequest } from "@/services";
import { useAuth } from "@/contexts/AuthContext";

interface RazorpayButtonProps {
  courseId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayButton({ courseId, onSuccess, onError }: RazorpayButtonProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const [ loading, setLoading ] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { order, course } = await createCheckoutSessionRequest(courseId);

      const options = {
        key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: course.title,
        description: course.description,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const data = await verifyPaymentRequest({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast({
              title: data?.message,
              description: "Your course purchase was successful!",
            });

            setLoading(false);
            onSuccess?.();
          } catch (error) {
            toast({
              variant: "destructive",
              title: (error as Error).message,
              description: "There was an error verifying your payment.",
            });
            setLoading(false);
            onError?.(error);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment window.",
              variant: "destructive",
            });
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment.",
      });
      onError?.(error);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full"
    >
      {loading ? "Processing..." : "Buy Now"}
    </Button>
  );
}