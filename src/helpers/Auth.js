
import {ethers} from 'ethers';

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const WalletLink = window.WalletLink;
const Torus = window.Torus;

export const INFURAID = '172bcbd122234ed19a83403ae5205f97';
// export const networkID = '0x3';
// export const networkName = 'ropsten';
// const mintContract = '0xa783b87423cf3e8262f5b121da614c12a40d00ae';
// export const explorerURL = 'https://ropsten.etherscan.io/tx/';

// export const networkID = '0x89';
// export const networkName = 'matic';
// const mintContract = '0xc78dea3cc2603796b04bd3c666a9a902a28ea141';
// export const explorerURL = 'https://polygonscan.com/tx';

// export const networkID = '0x4';
// export const networkName = 'rinkeby';
// const mintContract = '0xdc11dc12305c979368ce36f04384a27b4105940b';
// export const explorerURL = 'https://rinkeby.etherscan.io/tx/';

export const networkID = '0x1';
export const networkName = 'homestead';
const mintContract = '0x83d3350e49dd8bf66b088454e63e21f2bc778f1b';
export const explorerURL = 'https://etherscan.io/tx/';


const providerOptions = {
  injected: {
    display: {
      name: 'Injected',
      description: 'Connect with the provider in your Browser',
    },
    package: null,
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURAID, // required
    },
  },
  walletlink: {
    package: WalletLink, // Required
    options: {
      appName: 'Treasure drop', // Required
      infuraId: INFURAID, // Required unless you provide a JSON RPC url; see `rpc` below
    },
  },
  torus: {
    package: Torus, // required
    options: {
      config: {
      },
    },
  },
};


const web3Modal = new Web3Modal({
  theme: 'dark',
  cacheProvider: true, // optional
  providerOptions, // required
});


export const connectWallet = async (changeAuth) => {
  const instance = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(instance);
  const addresses = await provider.listAccounts();
  changeAuth(provider, addresses[0]);

  provider.provider.on('accountsChanged', (accounts) => {
    changeAuth(provider, accounts[0]);
  });

  // Subscribe to chainId change
  provider.provider.on('chainChanged', (chainId, oldNetwork) => {
    console.log(chainId);
    window.location.reload();
  });

  // Subscribe to provider disconnection
  provider.provider.on('disconnect', async () => {
    changeAuth(null, '');
  });
};

const mintContractABI = [
  'function mintPublic(string memory key) external payable',
];

// The Contract object

export const mintNFT = async (provider, mintCode, setTransactionStatus) => {
  setTransactionStatus('Pending');
  const mintContractInstance = new ethers.Contract(mintContract, mintContractABI, provider);
  const signer = provider.getSigner();
  const mintWithSigner = mintContractInstance.connect(signer);
  try {
    const tx = await mintWithSigner.mintPublic(mintCode);
    setTransactionStatus({
      status: 'Pending',
      hash: tx.hash,
    });

    const receipt = await tx.wait();
    setTransactionStatus({
      status: 'Success',
      hash: receipt.transactionHash,
    });
  } catch (error) {
    if (error.error) {
      alert(error.error.message);
      setTransactionStatus('Error: ' + error.error.message);
    } else if (error.message) {
      console.log(error.message);
      setTransactionStatus('Error: ' + error.message);
    } else {
      console.log(error);
      setTransactionStatus('Error: ' + error);
    }
  }
};
