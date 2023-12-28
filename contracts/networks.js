require("dotenv").config()

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2

const npmCommand = process.env.npm_lifecycle_event
const isTestEnvironment = npmCommand == "test" || npmCommand == "test:unit"

// Set EVM private key (required)
const PRIVATE_KEY = process.env.PRIVATE_KEY
console.log(PRIVATE_KEY);

if (!isTestEnvironment && !PRIVATE_KEY) {
  throw Error("Set the PRIVATE_KEY environment variable with your EVM wallet private key")
}

const networks = {
  fsc: {
    url: process.env.RPC_URL || "THIS HAS NOT BEEN SET",
    gasPrice: undefined,
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey: process.env.VERIFY_API_KEY,
    chainId: 201022,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "FON",
    explorerUrl: process.env.EXPLORER_URL,
    accounts: [process.env.PRIVATE_KEY, process.env.ACC1_PRIVATE_KEY],
  }
}

module.exports = {
  networks,
}