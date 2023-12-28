import { useEffect, useState } from "react";
import { calculateUnlockEvery } from "src/core/utils";
import { usePaymentRequest } from "src/hooks/usePaymentRequest";

export default function PaymentProcess({ payment }) {
    const [unlockAmount, setUnlockAmount] = useState(0);
    const [firstLoading, setFirstLoading] = useState(false);
    const { getUnlockSetting } = usePaymentRequest();
    useEffect(() => {
        if (!firstLoading) {
            let paymentAmount = payment.paymentAmount;
            let timeToUnlock = calculateUnlockEvery(payment.unlockEvery, payment.unlockEveryType);
            if (payment.status === 1) {
               
                let i = setInterval(function () {
                    let { unlockedAmount } = getUnlockSetting(payment)
                    console.log("Calculate");
                    setUnlockAmount(unlockedAmount);
                }, timeToUnlock * 1000)
            } else {
                setUnlockAmount(paymentAmount)
            }
            setFirstLoading(true)

        }

    }, [firstLoading, unlockAmount])

    return (

        <span>{unlockAmount} / {payment.paymentAmount}</span>

    )
}