import { PaymentRequest } from "src/controller/payment-list/paymentListSlice";

export const usePaymentRequest = () => {
    const getUnlockSetting = (paymentRequest: PaymentRequest) => {
        let unlockEvery = paymentRequest.unlockEvery;
        let unlockEveryType = "second";
        let unlockAmountPerTime = paymentRequest.unlockAmountPerTime;
        let startDate = paymentRequest.startDate;
        let numberOfUnlocks = paymentRequest.numberOfUnlocks;
        let withdrewAmount = paymentRequest.paymentAmount - paymentRequest.remainingBalance;

        let now = new Date().getTime();

        let diffTime = now - startDate;
        if (diffTime >=0) {
            if (diffTime / (1000 * unlockEvery) <= numberOfUnlocks) {
                numberOfUnlocks = Math.floor(diffTime / (1000 * unlockEvery));
            }
        } else {
            numberOfUnlocks = 0;
        }

        

        if (unlockEvery / 60 >= 1) {
            unlockEvery = unlockEvery / 60;
            unlockEveryType = "minute"
        } else if (unlockEvery / 3600 >=  1) {
            unlockEvery = unlockEvery / 3600;
            unlockEveryType = "hour"
        } else if (unlockEvery / (3600 * 24) >= 1) {
            unlockEvery = unlockEvery / (3600 * 24)
            unlockEveryType = "day"
        } else if (unlockEvery / (3600 * 24 * 30) >= 1) {
            unlockEvery = unlockEvery / (3600 * 24 * 30);
            unlockEveryType = "month";
        }

        unlockEvery = Math.floor(unlockEvery);

        let unlockedAmount = unlockAmountPerTime * numberOfUnlocks;
        if (paymentRequest.prepaidPercentage > 0) {
            unlockedAmount += ((paymentRequest.numberOfUnlocks * unlockAmountPerTime) * paymentRequest.prepaidPercentage / 10000)
        }
        return {
            unlockSettings: `${unlockAmountPerTime} / ${unlockEvery} ${unlockEveryType}(s)`,
            unlockedAmount: unlockAmountPerTime * numberOfUnlocks,
            withdrewAmount: withdrewAmount
        }

    };

    return { getUnlockSetting };
};