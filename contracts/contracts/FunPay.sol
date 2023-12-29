// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IFunPay.sol";
import "./interfaces/IUser.sol";

import "./libs/Structs.sol";

/**
 * @title FunPay contract: manage funds and payments.
 * @author levia2n
 * @notice version 1.0.0. In ver 2.0.0, this contract need to divide recurring payments to separated contracts.
 */
contract FunPay is IFunPay, IUSer, Pausable, ReentrancyGuard {
  // Data structure.
  uint private _requestCount;
  address private _contractOwner;
  mapping(uint => Structs.PaymentRequest) private _paymentRequests;
  mapping(address => uint[]) private _senderToRequests;
  mapping(address => uint[]) private _recipientToRequests;
  mapping(address => address[]) private _usersTokens;
  mapping(address => mapping(address => uint)) private _usersBalance;
  mapping(address => mapping(address => uint)) private _usersLockedAmount;

  constructor() Pausable() ReentrancyGuard() {
    _contractOwner = msg.sender;
  }

  /**
   * Handle case: someone sends a native token amount to this contract.
   */
  receive() external payable {
    address addressThis = address(this);
    address sender = msg.sender;
    address[] memory userTokens = _usersTokens[sender];
    bool isFoundToken = false;
    for (uint i = 0; i < userTokens.length; i++) {
      if (userTokens[i] == addressThis) {
        isFoundToken = true;
        break;
      }
    }

    if (!isFoundToken) {
      _usersTokens[sender].push(addressThis);
    }

    _usersBalance[sender][addressThis] += msg.value;
    emit Receive(sender, msg.value);
  }

  // Deposit tokens (native or custom token)
  function deposit(address _tokenAddress, uint _amount) external payable override whenNotPaused nonReentrant {
    require(_amount > 0, "_amount<=0");
    address sender = msg.sender;
    address[] memory userTokens = _usersTokens[sender];
    bool isFoundToken = false;
    for (uint i = 0; i < userTokens.length; i++) {
      if (userTokens[i] == _tokenAddress) {
        isFoundToken = true;
        break;
      }
    }

    if (!isFoundToken) {
      _usersTokens[sender].push(_tokenAddress);
    }

    if (_tokenAddress == address(this)) {
      _usersBalance[sender][_tokenAddress] += msg.value;
    } else {
      _usersBalance[sender][_tokenAddress] += _amount;
      IERC20(_tokenAddress).transferFrom(sender, address(this), _amount);
    }

    emit Deposit(sender, _tokenAddress, _amount);
  }

  // Get payer's payments.
  function getSenderRequests() external view override returns (Structs.PaymentRequest[] memory) {
    uint[] memory pr = _senderToRequests[msg.sender];
    Structs.PaymentRequest[] memory prArr = new Structs.PaymentRequest[](pr.length);
    for (uint i = 0; i < pr.length; i++) {
      prArr[i] = _paymentRequests[pr[i]];
    }

    return prArr;
  }

  // Get recipient's payments.
  function getRecipientRequests() external view override returns (Structs.PaymentRequest[] memory) {
    uint[] memory pr = _recipientToRequests[msg.sender];
    Structs.PaymentRequest[] memory prArr = new Structs.PaymentRequest[](pr.length);
    for (uint i = 0; i < pr.length; i++) {
      prArr[i] = _paymentRequests[pr[i]];
    }

    return prArr;
  }

  // Create a recurring payment.
  function createRecurringPayments(
    Structs.RecurringSetting memory _settings,
    Structs.RecurringRecipient[] memory _recipients
  ) external override whenNotPaused nonReentrant {
    require(_settings.startDate >= block.timestamp, "startDate<block.timestamp");
    uint count = _requestCount;
    address sender = msg.sender;
    uint totalAmount = 0;
    uint tokenBalance = _usersBalance[sender][_settings.tokenAddress];
    uint lockedAmount = _usersLockedAmount[sender][_settings.tokenAddress];
    uint payAmount = 0;
    Structs.RecurringRecipient memory recipient;

    for (uint i = 0; i < _recipients.length; i++) {
      recipient = _recipients[i];
      payAmount = recipient.unlockAmountPerTime * recipient.numberOfUnlocks;

      // If this payment request has a prepaid amount.
      if (recipient.prepaidPercentage > 0) {
        payAmount = _getAmountWithPrepaid(payAmount, recipient.prepaidPercentage);
      }
      totalAmount += payAmount;
    }

    // whether an user's balance is enough.
    require(tokenBalance - lockedAmount >= totalAmount, "totalAmount<balance");

    Structs.PaymentRequest memory pr;

    for (uint i = 0; i < _recipients.length; i++) {
      recipient = _recipients[i];
      payAmount = recipient.unlockAmountPerTime * recipient.numberOfUnlocks;
      if (recipient.prepaidPercentage > 0) {
        payAmount = _getAmountWithPrepaid(payAmount, recipient.prepaidPercentage);
      }
      uint256 requestId = count + i;
      pr = Structs.PaymentRequest(
        requestId,
        sender,
        _settings.tokenAddress,
        _settings.isNativeToken,
        _settings.startDate,
        payAmount,
        payAmount,
        recipient.prepaidPercentage,
        recipient.unlockAmountPerTime,
        recipient.unlockEvery,
        recipient.numberOfUnlocks,
        recipient.recipient,
        _settings.whoCanCancel,
        _settings.whoCanTransfer,
        1
      );
      _senderToRequests[sender].push(requestId);
      _recipientToRequests[recipient.recipient].push(requestId);
      _paymentRequests[requestId] = pr;
    }

    _requestCount += _recipients.length;
    lockedAmount += totalAmount;
    _usersLockedAmount[sender][_settings.tokenAddress] = lockedAmount;

    emit CreateRecurringPayment(sender);
  }

  // Create a onetime payment
  function createOneTimePayment(
    Structs.OneTimeSetting memory _settings,
    Structs.OneTimeRecipient[] memory _recipients
  ) external override whenNotPaused nonReentrant {
    address sender = msg.sender;
    uint count = _requestCount;

    uint totalAmount = 0;

    uint tokenBalance = _usersBalance[sender][_settings.tokenAddress];
    uint lockedAmount = _usersLockedAmount[sender][_settings.tokenAddress];

    Structs.OneTimeRecipient memory recipient;

    for (uint i = 0; i < _recipients.length; i++) {
      recipient = _recipients[i];
      totalAmount += recipient.amount;
    }

    require(tokenBalance - lockedAmount >= totalAmount, "totalAmount>balance");

    // If the payment is 'paynow' type
    if (_settings.isPayNow) {
      _usersBalance[sender][_settings.tokenAddress] -= totalAmount;

      for (uint i = 0; i < _recipients.length; i++) {
        recipient = _recipients[i];
        if (_settings.isNativeToken || _settings.tokenAddress == address(this)) {
          payable(recipient.recipient).transfer(recipient.amount);
        } else {
          IERC20(_settings.tokenAddress).transferFrom(address(this), recipient.recipient, recipient.amount);
        }
      }
    } else {
      require(_settings.startDate >= block.timestamp, "startDate<timestamp");

      Structs.PaymentRequest memory pr;

      for (uint i = 0; i < _recipients.length; i++) {
        recipient = _recipients[i];

        uint requestId = count + i;

        pr = Structs.PaymentRequest(
          requestId,
          sender,
          _settings.tokenAddress,
          _settings.isNativeToken,
          _settings.startDate,
          recipient.amount,
          recipient.amount,
          0,
          recipient.amount,
          1,
          1,
          recipient.recipient,
          3,
          3,
          1
        );

        _senderToRequests[sender].push(requestId);
        _recipientToRequests[recipient.recipient].push(requestId);
        _paymentRequests[requestId] = pr;
      }

      _requestCount += _recipients.length;
      lockedAmount += totalAmount;
      _usersLockedAmount[sender][_settings.tokenAddress] = lockedAmount;
    }
    emit CreateOneTimePayment(sender);
  }

  // Only the recipient can withdraw a token amount.
  function withdrawFromPaymentRequest(uint _requestId, uint _amount) external override whenNotPaused nonReentrant {
    require(_amount > 0, "amount<=0");
    Structs.PaymentRequest memory pr = _paymentRequests[_requestId];
    require(pr.sender != address(0), "!pr");
    require(msg.sender == pr.recipient, "sender!=recipient");

    uint unlockedAmount = _getRecipientUnlockedAmount(pr);

    uint withdrewAmount = pr.paymentAmount - pr.remainingBalance;

    require(unlockedAmount - withdrewAmount >= _amount, "amount>balance");

    uint remainingBalance = pr.remainingBalance;
    remainingBalance -= _amount;

    if (remainingBalance == 0) {
      _paymentRequests[_requestId].status = 3;
    }
    _paymentRequests[_requestId].remainingBalance = remainingBalance;
    _usersBalance[pr.sender][pr.tokenAddress] -= _amount;
    _usersLockedAmount[pr.sender][pr.tokenAddress] -= _amount;

    // Transfer a token amount.
    if (pr.isNativeToken) {
      payable(pr.recipient).transfer(_amount);
    } else {
      IERC20(pr.tokenAddress).transfer(pr.recipient, _amount);
    }

    emit WithdrawFromPaymentRequest(msg.sender, _requestId, _amount);
  }

  //Only the user with right privileges.
  function cancelPaymentRequest(uint _requestId) external override whenNotPaused nonReentrant {
    Structs.PaymentRequest memory paymentRequest = _paymentRequests[_requestId];
    require(paymentRequest.sender != address(0), "!requestId");
    require(paymentRequest.status == 1, "!active");
    bool checkPermission = _checkPermission(paymentRequest, true);

    // Check privileges
    require(checkPermission, "!permission");
    uint unlockedAmount = _getRecipientUnlockedAmount(paymentRequest);
    uint availableBalance = unlockedAmount - (paymentRequest.paymentAmount - paymentRequest.remainingBalance);

    // Change status
    _paymentRequests[_requestId].status = 2;
    _paymentRequests[_requestId].remainingBalance = 0;

    _usersBalance[msg.sender][paymentRequest.tokenAddress] -= availableBalance;
    _usersLockedAmount[msg.sender][paymentRequest.tokenAddress] -= paymentRequest.remainingBalance;

    // Transfer a token amount.
    if (paymentRequest.isNativeToken) {
      payable(paymentRequest.recipient).transfer(availableBalance);
    } else {
      IERC20(paymentRequest.tokenAddress).transfer(paymentRequest.recipient, availableBalance);
    }

    emit CancelPaymentRequest(msg.sender, _requestId);
  }

  // Transfer a payment to another recipient.
  function transferPaymentRequest(uint _requestId, address _to) external override whenNotPaused nonReentrant {
    Structs.PaymentRequest memory paymentRequest = _paymentRequests[_requestId];
    require(paymentRequest.sender != address(0), "!requestId");
    require(paymentRequest.status == 1, "!active");
    require(paymentRequest.recipient != _to, "old=new");
    bool checkPermission = _checkPermission(paymentRequest, false);
    require(checkPermission, "!permission");

    uint unlockedAmount = _getRecipientUnlockedAmount(paymentRequest);
    uint availableBalance = unlockedAmount - (paymentRequest.paymentAmount - paymentRequest.remainingBalance);

    _paymentRequests[_requestId].remainingBalance = paymentRequest.paymentAmount - unlockedAmount;
    _usersBalance[msg.sender][paymentRequest.tokenAddress] -= availableBalance;
    _usersLockedAmount[msg.sender][paymentRequest.tokenAddress] -= availableBalance;

    // Transfer to at here
    uint index = 0;
    uint[] memory requestIds = _recipientToRequests[paymentRequest.recipient];
    for (uint i = 0; i < requestIds.length; i++) {
      if (requestIds[i] == _requestId) {
        index = i;
        break;
      }
    }

    // Not keep ordered requestIds

    _recipientToRequests[paymentRequest.recipient][index] = requestIds[requestIds.length - 1];

    // Remove last element
    _recipientToRequests[paymentRequest.recipient].pop();

    // Move request payment to new recipient

    _recipientToRequests[_to].push(_requestId);

    // Change recipient

    _paymentRequests[_requestId].recipient = _to;

    // Transfer the available unlocked amount to the old recipient.
    if (paymentRequest.isNativeToken) {
      payable(paymentRequest.recipient).transfer(availableBalance);
    } else {
      IERC20(paymentRequest.tokenAddress).transfer(paymentRequest.recipient, availableBalance);
    }

    emit TransferPaymentRequest(msg.sender, _requestId, _to);
  }

  // Get an user's token balances.
  function getUserTokensBalance() external view override returns (Structs.Balance[] memory) {
    address sender = msg.sender;
    address[] memory tokens = _usersTokens[sender];
    Structs.Balance[] memory balances = new Structs.Balance[](tokens.length);
    Structs.Balance memory balance;
    for (uint i = 0; i < tokens.length; i++) {
      balance = Structs.Balance(tokens[i], _usersBalance[sender][tokens[i]], _usersLockedAmount[sender][tokens[i]]);
      balances[i] = balance;
    }
    return balances;
  }

  // withdraw from an user's balance 
  function withdrawBalance(address _tokenAddress, uint _amount) external override whenNotPaused nonReentrant {
    require(_amount > 0, "amount<=0");
    address sender = msg.sender;
    uint balance = _usersBalance[sender][_tokenAddress];
    uint lockedAmount = _usersLockedAmount[sender][_tokenAddress];

    require(balance - lockedAmount >= _amount, "amount>balance");

    _usersBalance[sender][_tokenAddress] -= _amount;

    if (_tokenAddress == address(this)) {
      payable(sender).transfer(_amount);
    } else {
      IERC20(_tokenAddress).transfer(sender, _amount);
    }

    emit WithdrawBalance(sender, _tokenAddress, _amount);
  }

  // Utilities
  function _getAmountWithPrepaid(uint _recurringAmount, uint8 _prepaidPercentage) private pure returns (uint) {
    uint prepaidAmount = (_recurringAmount * _prepaidPercentage) / 10000;
    return (_recurringAmount + prepaidAmount);
  }

  // Get the unlocked amount of a recurring payment.
  function _getRecipientUnlockedAmount(Structs.PaymentRequest memory _paymentRequest) private view returns (uint256) {
    uint unlockedAmount = 0;
    if (block.timestamp < _paymentRequest.startDate) {
      return unlockedAmount;
    }

    uint diffTime = block.timestamp - _paymentRequest.startDate;

    uint numberOfUnlock = diffTime / _paymentRequest.unlockEvery;

    if (numberOfUnlock > _paymentRequest.numberOfUnlocks) {
      return _paymentRequest.paymentAmount;
    } else {
      unlockedAmount = numberOfUnlock * _paymentRequest.unlockAmountPerTime;
    }

    if (_paymentRequest.prepaidPercentage > 0) {
      unlockedAmount +=
        (_paymentRequest.numberOfUnlocks * _paymentRequest.unlockAmountPerTime * _paymentRequest.prepaidPercentage) /
        10000;
    }

    return unlockedAmount;
  }

  // Check privileges
  function _checkPermission(
    Structs.PaymentRequest memory _paymentRequest,
    bool _cancelOrTransfer
  ) private view returns (bool) {
    bool flag = false;
    uint8 checkedValue = _cancelOrTransfer ? _paymentRequest.whoCanCancel : _paymentRequest.whoCanTransfer;

    if (checkedValue == 0) {
      if (_paymentRequest.sender == msg.sender) {
        flag = true;
      }
    } else if (checkedValue == 1) {
      if (_paymentRequest.recipient == msg.sender) {
        flag = true;
      }
    } else if (checkedValue == 2) {
      flag = true;
    }
    return flag;
  }

  // Check blockchain timestamp.
  function getBlockTimestamp() external view override returns (uint) {
    return block.timestamp;
  }
}
