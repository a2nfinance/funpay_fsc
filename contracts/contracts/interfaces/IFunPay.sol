// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../libs/Structs.sol";

interface IFunPay {
    function getSenderRequests() external view  returns (Structs.PaymentRequest[] memory);
    function getRecipientRequests() external view returns (Structs.PaymentRequest[] memory);
    function getBlockTimestamp() external view returns (uint);
}