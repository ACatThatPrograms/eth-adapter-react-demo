
import React from 'react';
import './App.css';


import ethAdapter from 'eth-adapter'

function App() {

    const [connected, setConnected] = React.useState(false);
    const [error, setError] = React.useState();
    const [storedValue, setStoredValue] = React.useState("n/a");

    const readStorage = async () => {
        setError("")
        let int = await ethAdapter.contractMethods.STORAGE.retrieve_view_IN0_OUT1();
        console.log(int);
        return int.toString();
    }

    const readAndUpdateStoredValue = async () => {
        setStoredValue(await readStorage());
    }

    const incValue = async () => {
        setError("")
        let currentInt = await readStorage();
        let res = await ethAdapter.contractMethods.STORAGE.store_nonpayable_IN1_OUT0({
            num: parseInt(currentInt) + 1
        })
        if (res.error) {
            console.log(res.error)
            return setError(res.error)
        }

        setError("Waiting for Tx...")

        await res.wait();

        

        setError("")

        await readAndUpdateStoredValue();
    }

    const connectWeb3 = async () => {
        await ethAdapter.connectToWeb3Wallet(() => setConnected(true));
    }

    // Set the default JSON Rpc
    React.useEffect(() => {
        ethAdapter.setJsonRpcProvider("http://localhost:8545");
    }, [])

    return (
        <div className="App" style={{ padding: "6rem" }}>
            <button disabled={!!connected} style={{ marginTop: "2rem" }} onClick={connectWeb3}>Connect</button> <br />
            <button style={{ marginTop: "2rem" }} onClick={readAndUpdateStoredValue}>Get Value</button> <br />
            <button style={{ marginTop: "2rem" }} disabled={!connected} onClick={incValue}>Inc++ Value</button> <br />
            <div style={{ marginTop: "2rem" }}>Value: {storedValue}</div>

            {error && <div style={{ marginTop: "4rem", color: "red", maxWidth: "100%", overflow: "auto" }}>
                <p>{error}</p>
            </div>}
        </div >
    );
}

export default App;
