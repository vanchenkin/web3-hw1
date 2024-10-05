import { ethers } from "ethers";
import { vars } from "hardhat/config";
import contractJson from "../artifacts/contracts/VanERC20.sol/VanERC20.json";

const API_URL = `https://rpc-amoy.polygon.technology`;

const PRIVATE_KEY_OWNER = vars.get("AMOY_PRIVATE_KEY_SECOND");
const PRIVATE_KEY_SIGNER = vars.get("AMOY_PRIVATE_KEY");

const CONTRACT_ADDRESS = "0x18A719c48aE9cb41Db58a3Ac1B8b2a4ddAA23ad7";

const provider = new ethers.JsonRpcProvider(API_URL);

const owner = new ethers.Wallet(PRIVATE_KEY_OWNER, provider);
const signer = new ethers.Wallet(PRIVATE_KEY_SIGNER, provider);

const ownerWallerContract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, owner);
const signerWalletContract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, signer);

async function main() {
    const value = ethers.parseUnits("18", "ether");

    let tx;

    try {
        tx = await ownerWallerContract.mint(owner, value);

        console.log(`Minted tokens by @owner: ${value}`);
    } catch (e) {
        console.log(e);
    }

    try {
        tx = await signerWalletContract.buy({
            value: 5,
        });

        console.log(`Bought tokens by @signer: ${value}`);
    } catch (e) {
        console.log(e);
    }

    try {
        tx = await ownerWallerContract.transfer(signer, value / 3n);

        console.log(`Transfer tokens from @owner to @signer: ${value / 3n}`);
    } catch (e) {
        console.log(e);
    }

    try {
        tx = await signerWalletContract.approve(owner, value);

        console.log(`Allow @owner to spend @signer's tokens: ${value / 6n}`);
    } catch (e) {
        console.log(e);
    }

    try {
        await tx.wait(3);
        tx = await ownerWallerContract.transferFrom(signer, owner, value / 6n);

        console.log(`Transfer tokens by @owner from @signer to @owner: ${value / 6n}`);
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
