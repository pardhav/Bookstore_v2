import { useState, useEffect } from "react";
import {
  PayPalScriptProvider,
  BraintreePayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { IFormValues } from "./detail";
import { createTransaction } from "modules/firebase/transactionServices";
import { useRouter } from "next/router";

// This values are the props in the UI
const style = { label: "paypal", layout: "vertical" };
interface IPaypalButtons {
  amount: string;
  userInfo: IFormValues;
  amounts: any;
}
export default function PaypalButtons(props: IPaypalButtons) {
  const { amount, userInfo, amounts } = props;
  const [clientToken, setClientToken] = useState(null);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const response = await (
        await fetch(
          "https://braintree-sdk-demo.herokuapp.com/api/braintree/auth"
        )
      ).json();
      setClientToken(response?.client_token || response?.clientToken);
    })();
  }, []);

  return (
    <>
      {clientToken ? (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
          <PayPalScriptProvider
            options={{
              "client-id": "test",
              components: "buttons",
              // "data-user-id-token": "your-tokenization-key-here",
              "data-client-token": clientToken,
              intent: "capture",
              vault: false,
            }}
          >
            <BraintreePayPalButtons
              style={{ label: "paypal", layout: "vertical" }}
              disabled={false}
              fundingSource="paypal" // Available values are: ["paypal", "card", "credit", "paylater", "venmo"]
              forceReRender={[style, amount]}
              createOrder={function (data, actions) {
                return actions.braintree
                  .createPayment({
                    flow: "checkout",
                    amount: amount, // Here change the amount if needed
                    currency: "USD", // Here change the currency if needed
                    intent: "capture",
                    enableShippingAddress: true,
                    shippingAddressEditable: false,
                    shippingAddressOverride: {
                      recipientName: `${userInfo.lastName} ${userInfo.firstName}`,
                      line1: userInfo.street,
                      city: userInfo.city,
                      countryCode: "US",
                      postalCode: userInfo.postalCode,
                      state: userInfo.state,
                      phone: userInfo.mobile,
                    },
                  })
                  .then((orderId) => {
                    return orderId;
                  });
              }}
              onApprove={function (data, actions) {
                return actions.braintree
                  .tokenizePayment(data)
                  .then(async (payload) => {
                    // Your code here after capture the order
                    await createTransaction(payload, userInfo.userId, amounts);
                    router.push("/myorders");
                  });
              }}
            />
          </PayPalScriptProvider>
        </div>
      ) : (
        <h1>Loading token...</h1>
      )}
    </>
  );
}
