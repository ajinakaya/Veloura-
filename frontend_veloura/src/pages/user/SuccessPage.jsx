import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderNumber = searchParams.get("orderNumber");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId && orderNumber) {
      const timer = setTimeout(() => {
        navigate(`/order-confirmation/${orderNumber}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, orderNumber, navigate]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-green-600 text-3xl font-bold mb-4">
        Payment Successful!
      </h1>
      <p>Your payment session ID is: <code>{sessionId}</code></p>
      <p>Redirecting to your order confirmation...</p>
    </div>
  );
};

export default SuccessPage;
