import { ethers } from "ethers";
import contractJson from "../artifacts/contracts/VanERC1155.sol/VanERC1155.json";

const API_URL = `https://rpc-amoy.polygon.technology`;

const CONTRACT_ADDRESS = "0xa8F803E06948f6C8dDE9471bCE43D32da40ED187";

const provider = new ethers.JsonRpcProvider(API_URL);

const contract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, provider);

// можно ввести адрес внутрь фильтра для поиск по адресу
async function main() {
    // ERC20
    // const transferEvents = await ownerWallerContract.queryFilter(ownerWallerContract.filters.Transfer(), -1)
    // console.log(transferEvents);

    const transferSingleEvents = await contract.queryFilter(contract.filters.TransferSingle(), 1)
    console.log(transferSingleEvents);

    const transferBatchEvents = await contract.queryFilter(contract.filters.TransferBatch(), -1)
    console.log(transferBatchEvents);

}
main();
