## 1. Overview
FunPay is an application that allows users to pay, invest and disburse using cryptocurrencies; the application is deployed on the FON Smart Chain platform.

## 2. Key Features

**One-Time Payment**

Enables users to send money to multiple recipients simultaneously, supporting direct payment to the wallet at that moment or scheduling payment for a specific time in the future.

**Recurring Payment:**

Enables users to send money to multiple recipients based on a predefined schedule, resembling periodic disbursements. For instance, the sender can configure the start date, the number of unlocks, unlock amount, time between payments, and the prepaid amount.

**Invoice**

Allows users to generate and send an invoice to clients, facilitating crypto payments for the specified invoice.

**Address Book**

Permits users to manage their address book, streamlining the process of filling in payment information.

**Balance Management**
Empowers users to deposit tokens into a Smart Contract and efficiently manage them.

**Upload CSV**
Allows senders to upload payment data for multiple recipients simultaneously.

## 3. How Funpay Works

The primary flow of a Payment is as follows:

![](https://funpay.a2n.finance/docs/crypto_streaming.jpg)

Additional features include:
- Assigning privileges for canceling and transferring payments.
- Cancelling payments.
- Transferring payments.

To ensure fairness to both parties, users must possess the qualified assigned privilege when canceling or transferring a payment. In such cases, the remaining amount will be calculated and transferred to the recipient or sender accordingly. These measures guarantee a balanced and equitable user experience for all participants.



## 4. Usecases

FunPay can be used for the following purposes:

- **Paying Freelancer Salaries and Subscription Services:** FunPay supports crypto streaming for payments, enabling freelancers to receive payments in real-time for their services or subscriptions. This feature provides security and transparency, protecting users in the labor market.

- **Transaction and Invoicing:** FunPay facilitates multiple transactions between parties, such as buyers and service providers. Additionally, it is suitable for micropayments, reducing transaction fees and costs for payers and other payment engines built on blockchain.

## 5. Technical implementation
![](https://funpay.a2n.finance/docs/system_architect.jpg)

We use Solidity and Hardhat to develop smart contracts. For the front-end development, we use NextJS and EthersJS.

## 6. Future Development
FunPay is currently in the process of developing numerous additional features. We have plans to integrate other applications catering to freelancers and job marketplaces. In the short term, our agenda includes:

- Optimizing and refactoring smart contracts.
- Introducing additional features related to invoices.
- Implementing notification systems.
- Integrating an Oracle to support fiat price conversion.
- Enhancing the user experience and optimizing UI components.

