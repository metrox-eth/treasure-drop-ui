// import {useState} from 'react';
import {useEffect} from 'react';
import {connectWallet} from '../helpers/Auth';


export default (props) => {
//   const [state, setState] = useState({
//     authUser: null,
//   });
  const {provider, address, displayAddress} = props.authData;
  const addressFromLocal = localStorage.getItem('address');


  const logout = () => {
    props.changeAuth(null, '');
  };
  useEffect(
      () => {
        if (!provider && addressFromLocal) {
          connectWallet(props.changeAuth);
        }
      },
      [],
  );

  return (
    <header className="App-header bg-white text-black p-3 border-8 border-black">
      <div className='float-left'>
        <a className='mx-3 hover:border-b-4 hover:border-lime-400' href="#project">
                PROJECT
        </a>.
        <a className='mx-3 hover:border-b-4 hover:border-lime-400' href="#community">
                COMMUNITY
        </a>.
        <a className='mx-3 hover:border-b-4 hover:border-lime-400' href="#faq">FAQ</a>
      </div>
      <div className='inline float-right'>
        {!address && <span className='mx-3 hover:border-b-4 hover:border-lime-400'>
          <button onClick={() => connectWallet(props.changeAuth)}>CONNECT WALLET</button>
        </span>}
        {address && <span className='mx-3 hover:border-b-4 hover:border-lime-400'>
          <button>{displayAddress}</button>
        </span>}
        {address && <span className='mx-3 hover:border-b-4 hover:border-lime-400'>
          <button onClick={logout}>LOGOUT</button>
        </span>}
      </div>
    </header>
  );
};
