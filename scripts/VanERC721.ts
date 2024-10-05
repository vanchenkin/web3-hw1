import { ethers } from "ethers";
import { vars } from "hardhat/config";
import contractJson from "../artifacts/contracts/VanERC721.sol/VanERC721.json";

const API_URL = `https://rpc-amoy.polygon.technology`;

const PRIVATE_KEY_OWNER = vars.get("AMOY_PRIVATE_KEY_SECOND");
const PRIVATE_KEY_SIGNER = vars.get("AMOY_PRIVATE_KEY");

const CONTRACT_ADDRESS = "0x3FB81908f5e110Fc4757d5c91F3F535fa166BF4a";

const provider = new ethers.JsonRpcProvider(API_URL);

const owner = new ethers.Wallet(PRIVATE_KEY_OWNER, provider);
const signer = new ethers.Wallet(PRIVATE_KEY_SIGNER, provider);

const ownerWallerContract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, owner);
const signerWalletContract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, signer);

async function main() {
    let tx;

    try {
        tx = await ownerWallerContract.safeMint(signer, 6);

        console.log(`Minted tokens by @owner to signer: 6`);
    } catch (e) {
        console.log(e);
    }

    try {
        await tx.wait(3);

        tx = await signerWalletContract.safeTransferFrom(signer, owner, 6);

        console.log(`Transfer tokens from @signer to @owner: 6`);
    } catch (e) {
        console.log(e);
    }

    try {
        await tx.wait(3);

        const ownerBalance = await ownerWallerContract.balanceOf(owner);
        const signerBalance = await signerWalletContract.balanceOf(signer);
        console.log(`Balances @owner: ${ownerBalance}, @signer: ${signerBalance}`);
    } catch (e) {
        console.log(e);
    }
}
main();
