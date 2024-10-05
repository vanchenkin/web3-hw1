import { ethers } from "ethers";

const API_URL = `https://rpc-amoy.polygon.technology`;

const CONTRACT_ADDRESS = "0x18A719c48aE9cb41Db58a3Ac1B8b2a4ddAA23ad7";

const provider = new ethers.JsonRpcProvider(API_URL);
async function main() {
    for (let i = 0; i < 100; i++) {
        const slot = await provider.getStorage(CONTRACT_ADDRESS, i);
        const convertedSupply = BigInt(slot);

        console.log(convertedSupply);
    }
}
main();
