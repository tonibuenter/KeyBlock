# Polysafe Dev

## Compile

truffle compile

## Migrate/Deploy

`truffle migrate --network development`


## Start test (with debug option)

`truffle test --debug`



## Migrate/Deploy to polygon_mumbai

`truffle migrate --network polygon_mumbai`


## Deployed Contracts

POLYSAFE_CONTRACT_ADDRESS_POLYGON_MUMBAI=0xF52B33B9E5882D76339Cef52D57177be70caa9C2



## ChatGPT request for a front end

I need a html front end project with the following specification:
- use nodejs and TypeScript
- use reactjs 18, ag-grid for react, mui.com library, web3 library for metamask access
- landing page is ag-grid table with two columns: name and secret and a save button 
- the data for the table is requested from polygon mumbai blockchain
- a login appears first which request that the meta mask browser extensions should connect to the polygon mumbai blockchain
- after the login the data for the table is retrieved from the blockchain and filled into the table
- the user can add a row with name and secret
- the user can change the name and secret for any row
- the user can click on a save button on the right side of the row


## Result 

To create this HTML front-end project, follow these steps:

1. Set up the development environment
2. Create a new React project
3. Add required dependencies
4. Create components for the login and landing page
5. Implement web3 and MetaMask integration
6. Connect to the Polygon Mumbai blockchain
7. Fetch and save data to the blockchain

Here is a basic structure to get you started:

1. Set up the development environment:

- Install Node.js: https://nodejs.org/en/download/
- Install Visual Studio Code or your preferred code editor

2. Create a new React project:

```
npx create-react-app my-app
cd my-app
```

3. Add required dependencies:

```
npm install @mui/material @emotion/react @emotion/styled ag-grid-react ag-grid-community web3
```

4. Create components for the login and landing page:

- Create a new folder called "components" inside the "src" folder
- Inside the "components" folder, create two files: "Login.js" and "LandingPage.js"

5. Implement web3 and MetaMask integration:

- In "Login.js", import web3 and create a function to request MetaMask connection and switch to the Polygon Mumbai network.

```javascript
import { useEffect, useState } from "react";
import Web3 from "web3";

const Login = ({ setConnected }) => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    }
  }, []);

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
      setConnected(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={connectMetaMask}>Connect MetaMask</button>
    </div>
  );
};

export default Login;
```

6. Connect to the Polygon Mumbai blockchain:

- In "LandingPage.js", import the required libraries and create a function to fetch and save data to the blockchain.

```javascript
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const LandingPage = () => {
  const rowData = []; // Initialize with data fetched from the blockchain

  const onGridReady = (params) => {
    // Implement logic to fetch data from the blockchain and fill the rowData
  };

  const saveData = (row) => {
    // Implement logic to save the data to the blockchain
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "500px", width: "800px" }}>
      <AgGridReact rowData={rowData} onGridReady={onGridReady}>
        <AgGridColumn field="name" editable={true}></AgGridColumn>
        <AgGridColumn field="secret" editable={true}></AgGridColumn>
        <AgGridColumn
          field="save"
          cellRendererFramework={(params) => (
            <Button onClick={() => saveData(params.data)}>Save</Button>
          )}
        ></AgGridColumn>
      </AgGridReact>
    </div>
  );
};

export default LandingPage;
```

7. Import and use the components in
7. Import and use the components in the "App.js" file:

- Import the Login and LandingPage components in "App.js"
- Use the "connected" state to conditionally render the Login or LandingPage component

```javascript
import { useState } from "react";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";

function App() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="App">
      {!connected ? (
        <Login setConnected={setConnected} />
      ) : (
        <LandingPage />
      )}
    </div>
  );
}

export default App;
```

Now you have a basic structure for your project. You will need to implement the actual logic for fetching and saving data from/to the Polygon Mumbai blockchain. To do this, you can use the web3 library and create smart contracts to store and retrieve data.

You can learn more about creating smart contracts and interacting with them using web3.js in the official documentation: https://web3js.readthedocs.io/en/v1.3.4/
