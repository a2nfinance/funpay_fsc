task("deploy-funpay", "deploy  FunPay.sol").setAction(async (taskArgs, hre) => {
    console.log("\n__Compiling Contracts__")
    await run("compile")

    const funpayFactory = await ethers.getContractFactory("FunPay");
    const funpayContract = await funpayFactory.deploy();

    await funpayContract.deployTransaction.wait(1)
    console.log(`\nFunPay contract is deployed to at ${funpayContract.address}`)

})