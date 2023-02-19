import console from "console-browserify";
import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ABI, contractaddresses } from "../constant";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
const StakeContractFunctions = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex); //5
  const contractAddresses =
    chainId in contractaddresses ? contractaddresses[chainId][0] : null;

  console.log(contractAddresses);
  const [stakeAmt, setStakeAmount] = useState("0");
  const [currentBalance, setCurrentBalance] = useState("0");
  const [stakerList, setStakerList] = useState([]);
  let [deadLineInterval, setDeadlineInterval] = useState(0);
  const [test, setTest] = useState("HEY");

  const { runContractFunction: stakeMinimumPayment } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddresses,
    functionName: "stakeMinimumPayment",
    params: {},
  });

  const { runContractFunction: stake } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddresses,
    functionName: "stake",
    params: {},
    msgValue: stakeAmt,
  });

  const { runContractFunction: contractBalance } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddresses,
    functionName: "contractBalance",
    params: {},
  });

  const { runContractFunction: getStakers } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddresses,
    functionName: "getStakers",
    params: {},
  });
  const { runContractFunction: withdraw } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddresses,
    functionName: "withdraw",
    params: {},
  });

  const { runContractFunction: getLastBlockTimeStamp } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddresses,
    functionName: "getLastBlockTimeStamp",
    params: {},
  });

  const updateUI = async () => {
    const stakeAmtTxRes = (await stakeMinimumPayment()).toString();
    const stakerListTx = await getStakers();
    const balanceTx = (await contractBalance()).toString();
    setStakeAmount(stakeAmtTxRes);
    setStakerList(stakerListTx);
    setCurrentBalance(balanceTx);

    setTest("HELO");
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const dispatch = useNotification();
  const handleStake = async () => {
    await stake({
      onSuccess: handleSuccess,
      onError: (e) => {
        if (e.message.includes("User denied transaction signature")) {
          errorNotification();
        }
      },
    });
  };
  const handleWithdraw = async () => {
    await withdraw({
      onSuccess: handleSuccess,
      onError: (e) => {
        if (e.message.includes("Staking_NotPassed()")) {
          errorNotification("Stakers Not Up To 3");
        }
      },
    });
  };

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    await successNotification();
    await updateUI();
  };

  const successNotification = async () => {
    dispatch({
      type: "success",
      message: "Transaction success",
      position: "topR",
    });
  };

  const errorNotification = async (msg) => {
    dispatch({
      type: "error",
      message: msg,
      position: "topR",
    });
  };
  return (
    <div className="staking-dashboard">
      {contractAddresses ? (
        <div>
          <div className="contract_bal">
            {currentBalance && (
              <h1>
                Contract Balance:
                <span className="">
                  {ethers.utils.formatUnits(currentBalance, "ether")}
                </span>
                <small>ETH</small>
              </h1>
            )}
          </div>
          <div className="minimum_stake">
            {stakeAmt && (
              <p>
                Minimum Stake is {ethers.utils.formatUnits(stakeAmt, "ether")}{" "}
                ETH
              </p>
            )}
          </div>
          <div className="wrapper">
            <div className="left">
              <div className="staker_activity margin">
                {stakeAmt && (
                  <h1>
                    Your Stake Balance:
                    <span>{ethers.utils.formatUnits(stakeAmt, "ether")}</span>
                    <small>ETH</small>
                  </h1>
                )}
                <div className="stakeBtn">
                  <button onClick={handleStake}>Stake</button>
                </div>
                <h3>Stake Deadline: {deadLineInterval} secs</h3>
              </div>
              <div className="staker_activity">
                {stakeAmt && (
                  <h1>
                    Withdraw {ethers.utils.formatUnits(currentBalance, "ether")}{" "}
                    eth
                  </h1>
                )}
                <div className="stakeBtn">
                  <button onClick={handleWithdraw}>Withdraw</button>
                </div>
              </div>
            </div>
            <div className="right">
              <h1>All Stakers Address</h1>
              {stakerList.length > 0 ? (
                stakerList.map((address, index) => (
                  <ul>
                    <li>
                      {index + 1}. {address}
                    </li>
                  </ul>
                ))
              ) : (
                <h1>No stakers yet</h1>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h1 className="no_adddress_found">
          No Address Found 😢. Connect Your Wallet
        </h1>
      )}
    </div>
  );
};

export default StakeContractFunctions;
