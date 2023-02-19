import React from "react";
import { ConnectButton } from "web3uikit";
const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <h1>De-Stake</h1>
      </div>
      <div className="connect">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
};

export default Header;
