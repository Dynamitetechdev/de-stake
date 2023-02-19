import Header from "./pages/header";
import { MoralisProvider } from "react-moralis";
import StakeContractFunctions from "./pages/stakeContractFunctions";
import { NotificationProvider } from "web3uikit";

function App() {
  return (
    <div className="App">
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header />
          <StakeContractFunctions />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default App;
