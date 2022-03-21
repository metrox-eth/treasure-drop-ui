import './App.css';
import artifactIcon from './images/artifact-icon.svg';
import nftIcon from './images/nft-icon.svg';
import snapshotLogo from './images/snapshot-logo.svg';
import discordIcon from './images/discord-icon.svg';
import twitterIcon from './images/twitter-logo.svg';
import Header from './components/Header';
import {useState} from 'react';
import {connectWallet, INFURAID, mintNFT, networkName, networkID, explorerURL} from './helpers/Auth';
import {ethers} from 'ethers';


function App() {
  const [state, setState] = useState({auth: {address: '', provider: null, displayAddress: '', network: null, mintCode: ''}});
  const changeAuth = async (provider, address) => {
    let displayAddress = '';
    let network = null;
    if (address) {
      const ethProvider = ethers.getDefaultProvider('homestead', {
        infura: INFURAID,
      });
      const ENSName = await ethProvider.lookupAddress(address);
      displayAddress = ENSName ? ENSName.toUpperCase() : (address.substring(0, 6) + '...' + address.substring(address.length - 4)).toUpperCase();
      network = provider.network.name;
      console.log(network);
    }
    localStorage.setItem('address', address);
    setState({
      ...state,
      auth: {provider, address, displayAddress, network},
    });
  };
  const mintButtonClick = () => {
    if (!state.auth.address) {
      connectWallet(changeAuth);
    } else {
      mintNFT(state.auth.provider, state.mintCode, setTransactionStatus);
    }
  };
  const onMintCodeChange = (e) => {
    setState({
      ...state,
      mintCode: e.target.value || '',
    });
  };
  const setTransactionStatus = (status) => {
    setState({
      ...state,
      transactionStatus: status,
    });
  };
  const correctNetwork = state.auth.network === networkName || state.auth.network === networkID;
  return (
    <div className="App">
      <div className='main-content'>
        <div className='main-background-image'></div>
        <div className='content'>
          <Header changeAuth={changeAuth} authData={state.auth}/>
          <div className="flex flex-row flex-wrap bg-white text-black mint-wrapper  border-8 border-t-0 border-black">
            <div className="relative basis-full md:basis-1/2 border-r-0 md:border-r-8 border-black">
              <div className='flex flex-row'>
                <div className="basis-1/2 md:basis-full border-r-4 border-b-8 border-black">
                  <div className="m-2">
                    <img src={artifactIcon} alt="artifactIcon" className='w-48 mx-auto my-16 '/>
                  </div>
                </div>
                <div className="basis-1/2 md:basis-full border-b-8 border-l-4 border-black">
                  <div className='border-b-8 border-black'>
                    <a target="_blank" href="https://snapshot.org/#/pistachiodao.eth"><img src={snapshotLogo} alt="artifactIcon" className='w-12 max-w-xs mx-auto my-16'/></a>
                  </div>
                  <div className='flex flex-row'>
                    <div className='basis-1/2 border-r-4 border-black'>
                      <a target="_blank" href="https://discord.snapshot.org/"><img src={discordIcon} alt="artifactIcon" className='w-12 max-w-xs mx-auto my-16'/></a>
                    </div>
                    <div className='basis-1/2 border-l-4 border-black'>
                      <a target="_blank" href="https://twitter.com/snapshotLabs"><img src={twitterIcon} alt="artifactIcon" className='w-12 max-w-xs mx-auto my-16'/></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className='md:absolute relative bottom-0 w-full'>
                <div className='align-middle'>

                  <h1 className='text-xl mt-20'>ENTER YOUR CODE TO MINT</h1>
                  <input className='p-6 bg-slate-100 w-80 m-6' type="text"
                    placeholder="0x0000000000000000000000000000000000"
                    onChange={onMintCodeChange}
                  />
                  <div className='absolute w-full'>
                    {state.transactionStatus && (
                      typeof state.transactionStatus === 'string' && <div>Txn: {state.transactionStatus}</div>
                    )}
                    {state.transactionStatus && (
                      typeof state.transactionStatus === 'object' && <div>Txn: {state.transactionStatus.status} - <a target="_blank" href={explorerURL + state.transactionStatus.hash}>{
                        state.transactionStatus.hash.substring(0, 6) + '...' + state.transactionStatus.hash.substring(state.transactionStatus.hash.length - 4)
                      }</a></div>
                    )}
                  </div>
                  <div>
                    <button className={`p-3 w-full mt-20 bg-black text-slate-50 hover:text-yellow-500 ${!correctNetwork ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={mintButtonClick} disabled={!correctNetwork}>{state.auth.address ?
                     (correctNetwork ? 'MINT': 'WRONG NETWORK') :
                     'CONNECT WALLET'
                      }</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-full md:basis-1/2 bg-slate-50 nft-icon border-b-8 border-8 md:border-0 border-black">
              <img src={nftIcon} alt="nftIcon" className='h-full'/>
            </div>
          </div>
          {/* <div className='py-40'>
            <h1 className='title-name text-5xl'>
              TREASURE DROP
            </h1>
          </div> */}
        </div>

      </div>
    </div>
  );
}

export default App;
