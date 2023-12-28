const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");


describe("FunPay contracts", () => {

  async function deployTokenFixture() {
    const [user1, user2] = await ethers.getSigners();
    const funpayInstance = await ethers.deployContract("FunPay");
    return { funpayInstance, user1, user2 };
  }
  it("Deposit 0.005", async () => {
    const { funpayInstance, user1 } = await loadFixture(deployTokenFixture);
    let amount = ethers.utils.parseEther("0.005");
    await user1.sendTransaction({
      to: funpayInstance.address,
      value: amount
    })
    let userBalance = await funpayInstance.getUserTokensBalance.call()
    assert.equal(userBalance[0].tokenAddress, funpayInstance.address, "0.005 is not equal balance");
  });

  it("Create recurring payments", async () => {
    const { funpayInstance, user1, user2 } = await loadFixture(deployTokenFixture);
    let amount = ethers.utils.parseEther("0.005");
    await user1.sendTransaction({
      to: funpayInstance.address,
      value: amount
    })
    let unlockAmountPerTime = ethers.utils.parseEther("0.001");
    let paymentAmount = ethers.utils.parseEther("0.002");
    let now = new Date().getTime();
    let recurringSettings = [
      funpayInstance.address,
      true,
      Math.floor(now / 1000) + 10,
      0,
      0
    ];

    let recurringRecipients = [[
      user2.address,
      10,
      unlockAmountPerTime,
      2,
      0
    ]];

    await funpayInstance.createRecurringPayments(recurringSettings, recurringRecipients);
    let senderRequests = await funpayInstance.getSenderRequests.call();
    assert.equal(senderRequests[0].paymentAmount.toString(), paymentAmount, "Payment amount is incorrect!");
  });


  it("Create one time payments", async () => {
    const { funpayInstance, user1, user2 } = await loadFixture(deployTokenFixture);
    let amount = ethers.utils.parseEther("0.005");
    await user1.sendTransaction({
      to: funpayInstance.address,
      value: amount
    })
    let paymentAmount = ethers.utils.parseEther("0.002");
    let now = new Date().getTime();
    let onetimeSettings = [
      funpayInstance.address,
      true,
      Math.floor(now / 1000) + 10,
      false
    ];

    let onetimeRecipients = [[
      user2.address,
      paymentAmount
    ]];
    await funpayInstance.createOneTimePayment(onetimeSettings, onetimeRecipients);
    let recipientRequests = await funpayInstance.connect(user2).getRecipientRequests.call();
    assert.equal(recipientRequests[0].paymentAmount.toString(), paymentAmount, "Payment amount is incorrect!");
  });

  it("Check withdraw from request", async () => {
    const { funpayInstance, user1, user2 } = await loadFixture(deployTokenFixture);
    let amount = ethers.utils.parseEther("0.005");
    await user1.sendTransaction({
      to: funpayInstance.address,
      value: amount
    })
    let unlockAmountPerTime = ethers.utils.parseEther("0.001");
    let remainingBalance = ethers.utils.parseEther("0.001");
    let now = new Date().getTime();
    let recurringSettings = [
      funpayInstance.address,
      true,
      Math.floor(now / 1000) + 10,
      0,
      0
    ];

    let recurringRecipients = [[
      user2.address,
      10,
      unlockAmountPerTime,
      2,
      0
    ]];

    await funpayInstance.createRecurringPayments(recurringSettings, recurringRecipients);
    await new Promise(resolve => setTimeout(resolve, 20000));
    await funpayInstance.connect(user2).withdrawFromPaymentRequest(0, ethers.utils.parseEther("0.001"));
    let senderRequests = await funpayInstance.connect(user2).getRecipientRequests.call();
    assert.equal(senderRequests[0].remainingBalance.toString(), remainingBalance, "Payment amount is incorrect!");
  });
})