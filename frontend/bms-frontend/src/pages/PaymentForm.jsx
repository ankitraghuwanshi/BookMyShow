import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, message as antMessage } from "antd";

const PaymentForm = ({ onSuccess, amount, show, selectedSeats, userId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/booking-success`,
                },
                redirect: 'if_required'
            });

            if (error) {
                antMessage.error(error.message);
                setLoading(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                antMessage.success("Payment successful!");
                onSuccess(paymentIntent.id);
            }
        } catch (err) {
            antMessage.error(err.message || "Payment failed");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            
            <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <div className="flex justify-between mb-2">
                    <span className="font-medium">Selected Seats:</span>
                    <span>{selectedSeats.join(", ")}</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{amount / 100}</span>
                </div>
            </div>

            <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                disabled={!stripe || loading}
            >
                {loading ? 'Processing...' : `Pay ₹${amount / 100}`}
            </Button>
        </form>
    );
};

export default PaymentForm;