## Introduction
FunPay is an application designed for users to make payments, investments, and disbursements using cryptocurrencies. The application is deployed on the FON Smart Chain platform.

To test this app, you'll need to install the Metamask wallet and exchange FON or any token on [Hieswap](https://hieswap.com/)

**Demo:** [FunPay dApp](https://funpay.a2n.finance)

**Smart Contract:** [FunPay Smart Contract](https://fonscan.io/address/0x0F718444De2eD7c35FFdEDEb476CE1c62b6d0096?tab=contract)

## Features
- [x] Deposit.
- [x] Create batch recurring payments.
- [x] Create batch onetime payments.
- [x] Manage Address book.
- [x] Create invoice.
- [x] Withdraw
- [x] Cancel payment.
- [x] Transfer payment.
- [x] Pay invoice.
- [x] Cancel/Reject/Pause/Active invoice.
- [x] Show user's sent payments.
- [x] Show user's received payments.
- [x] View all invoices.
- [x] Upload .csv.
- [x] Manage user permissions for payments.
- [ ] Reports & Statistics.
- [ ] Pause payment.
- [ ] Create invoice with recurring payement options.
- [ ] Payment SDK.


## TechStack

### To build smart contract, we use:
Solidity, Open Zeppelin, React, Redux, TypeScript, NodeJS, EthersJS, and FON smart chain mainnet.

## Architecture

- Frontend (UI/UX): use NextJS and Chakra UI framework.
- Data Handler: read/write cloud database
- Smart contract interaction: use EthersJS to send transactions.
- Wallet Connector: use Metamask API to connect wallet.

## How to deploy
Go to folder contracts: ```cd contracts```
- Deploy mock tokens:
    - Use: ```npx hardhat deploy-contract  --network fsc --show-stack-traces ```
- Verify contracts:
    - Use: ```npx hardhat verify --network fsc {contract address}```

## Screenshots
### Homepage

![home page](public/docs/homepage.png)

### Create recurring payments

![recurring payment page](public/docs/create_recurring_payment.png)

### Create onetime payments

![onetime payment page](public/docs/create_onetime_payment.png)

### Create new invoice

![Create invoice](public/docs/create_invoice.png)

### Manage balance

![Balance](public/docs/balance.png)

### Manage address book

![Adddress book](public/docs/address_book.png)



