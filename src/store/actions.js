import { parseBalance } from 'utils/helper';
import ERC20 from 'Contracts/ERC20.json';
import Farm from 'Contracts/farm/Farm.json';
import Vesting from 'Contracts/farm/Vesting.json';
import { getContractAddress } from 'utils/getContractAddress';
import { message } from 'antd';

var contractAddress;

////////////////////
// Common
////////////////////

export const SET_WEB3 = 'SET_WEB3';
export const setWeb3 = (web3) => async (dispatch, getState) => {
  dispatch({ type: SET_WEB3, web3 });

  let chainId = getState().chainId ? getState().chainId : await web3.eth.net.getId();
  contractAddress = getContractAddress(chainId);
};

export const SET_CHAINID = 'SET_CHAINID';
export const setChainId = (chainId) => (dispatch) => {
  dispatch({ type: SET_CHAINID, chainId });
};

export const SET_LIST_TOKENS_FARM = 'SET_LIST_TOKENS_FARM';
export const setListTokensFarm = (listTokensFarm) => (dispatch) => {
  dispatch({ type: SET_LIST_TOKENS_FARM, listTokensFarm });
};

export const SET_ADMIN_ADDRESS = 'SET_ADMIN_ADDRESS';
export const setAdminAddress = (addressesProvider) => async (dispatch) => {
  let adminAddress = await addressesProvider.methods.getAdmin().call();
  dispatch({
    type: SET_ADMIN_ADDRESS,
    adminAddress,
  });
};

export const SET_ADDRESS = 'SET_ADDRESS';
export const setAddress = (walletAddress) => (dispatch) => {
  if (walletAddress !== null) {
    var shortAddress = `${walletAddress.slice(0, 8)}...${walletAddress.slice(
      walletAddress.length - 6,
      walletAddress.length
    )}`;
    dispatch({
      type: SET_ADDRESS,
      walletAddress,
      shortAddress,
    });
    dispatch(setBalance());
  }
};

export const SET_BALANCE = 'SET_BALANCE';
export const setBalance = () => async (dispatch, getState) => {
  let { web3, walletAddress } = getState();
  let balance;
  if (walletAddress !== null)
    balance = parseBalance((await web3.eth.getBalance(walletAddress)).toString(), 18);
  else balance = 0;
  dispatch({
    type: SET_BALANCE,
    balance,
  });
};

export const approveFarm = (addressToken, contractFarm) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();

  try {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, addressToken);
    await instaneErc20.methods
      .approve(contractFarm, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        message.success('Approve Successfully !');
        return true;
      })
      .on('error', (error, receipt) => {
        console.log(error);
        message.error('Oh no! Something went wrong !');
        return false;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const checkAllowanceFarm = (addressToken, contractFarm) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();
  try {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, addressToken);
    let allowance = await instaneErc20.methods.allowance(walletAddress, contractFarm).call();
    return allowance;
  } catch (error) {
    console.log(error);
    message.error('Oh no! Something went wrong !');
  }
};

export const depositFarm = (amount, contractFarm) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();

  try {
    const instaneFarm = new web3.eth.Contract(Farm.abi, contractFarm);
    const amountWei = web3.utils.toWei(amount.toString(), 'ether');
    await instaneFarm.methods
      .deposit(amountWei)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        message.success('Deposit Successfully !');
        return true;
      })
      .on('error', (error, receipt) => {
        console.log(error);
        message.error('Oh no! Something went wrong !');
        return false;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const withdrawFarm = (amount, contractFarm) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();
  try {
    const instaneFarm = new web3.eth.Contract(Farm.abi, contractFarm);
    const amountWei = web3.utils.toWei(amount.toString(), 'ether');
    await instaneFarm.methods
      .withdraw(amountWei)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        message.success('Withdraw Successfully !');
        return true;
      })
      .on('error', (error, receipt) => {
        console.log(error);
        message.error('Oh no! Something went wrong !');
        return false;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const fetchPendingReward = (contractFarm) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();
  try {
    const instaneFarm = new web3.eth.Contract(Farm.abi, contractFarm);
    let pendingReward = await instaneFarm.methods.pendingReward(walletAddress).call();
    return pendingReward;
  } catch (error) {
    console.log(error);
    message.error('Oh no! Something went wrong !');
  }
};
export const fetchAmountStake = (contractFarm) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();
  try {
    const instaneFarm = new web3.eth.Contract(Farm.abi, contractFarm);
    let amountStake = await instaneFarm.methods.userInfo(walletAddress).call();
    return amountStake.amount;
  } catch (error) {
    console.log(error);
    message.error('Oh no! Something went wrong !');
  }
};

export const fetchBalanceLP = (addressToken) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();
  try {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, addressToken);
    let balanceLP = await instaneErc20.methods.balanceOf(walletAddress).call();
    return balanceLP;
  } catch (error) {
    console.log(error);
    message.error('Oh no! Something went wrong !');
  }
};

export const fetchVestingTotalClaimableAmount = (contractVesting) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();
  try {
    const instaneVesting = new web3.eth.Contract(Vesting.abi, contractVesting);
    let amountClaumable = await instaneVesting.methods
      .getVestingTotalClaimableAmount(walletAddress)
      .call();
    return amountClaumable;
  } catch (error) {
    console.log(error);
    message.error('Oh no! Something went wrong !');
  }
};
export const fetchTotalAmountLockedByUser = (contractVesting) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();
  try {
    const instaneVesting = new web3.eth.Contract(Vesting.abi, contractVesting);
    let amountLocking = await instaneVesting.methods
      .getTotalAmountLockedByUser(walletAddress)
      .call();
    return amountLocking;
  } catch (error) {
    console.log(error);
    message.error('Oh no! Something went wrong !');
  }
};

export const claimTotalVesting = (contractVesting) => async (dispatch, getState) => {
  const { web3, walletAddress } = getState();
  try {
    const instaneVesting = new web3.eth.Contract(Vesting.abi, contractVesting);
    await instaneVesting.methods
      .claimTotalVesting()
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        message.success('Claim Successfully !');
        return true;
      })
      .on('error', (error, receipt) => {
        console.log(error);
        message.error('Oh no! Something went wrong !');
        return false;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
};