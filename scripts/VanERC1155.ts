import { ethers } from "ethers";
import { vars } from "hardhat/config";
import contractJson from "../artifacts/contracts/VanERC1155.sol/VanERC1155.json";

const API_URL = `https://rpc-amoy.polygon.technology`;

const PRIVATE_KEY_OWNER = vars.get("AMOY_PRIVATE_KEY_SECOND");
const PRIVATE_KEY_SIGNER = vars.get("AMOY_PRIVATE_KEY");

const CONTRACT_ADDRESS = "0xa8F803E06948f6C8dDE9471bCE43D32da40ED187";

const provider = new ethers.JsonRpcProvider(API_URL);

const owner = new ethers.Wallet(PRIVATE_KEY_OWNER, provider);
const signer = new ethers.Wallet(PRIVATE_KEY_SIGNER, provider);

const ownerWallerContract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, owner);
const signerWalletContract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, signer);

async function main() {
    const value = ethers.parseUnits("18", "ether");

    let tx;

    const tokenType = await ownerWallerContract.MAIN_TOKEN_ID();

    console.log(`Token type: #${tokenType}`);

    try {
        tx = await ownerWallerContract.mint(signer, tokenType, value, Buffer.from(""));

        console.log(`Minted tokens to @signer: ${value} of #${tokenType}`);
    } catch (e) {
        console.log(e);
    }

    try {
        await tx.wait(3);

        tx = await signerWalletContract.safeTransferFrom(
            signer,
            owner,
            tokenType,
            value / 2n,
            Buffer.from("")
        );

        console.log(`Transfer tokens from @signer to @owner: ${value / 2n}`);
    } catch (e) {
        console.log(e);
    }

    try {
        await tx.wait(3);

        const ownerBalance = await ownerWallerContract.balanceOf(owner, tokenType);
        const signerBalance = await signerWalletContract.balanceOf(signer, tokenType);
        console.log(
            `Balances @owner: ${ownerBalance} #${tokenType}, @signer: ${signerBalance} #${tokenType}`
        );
    } catch (e) {
        console.log(e);
    }
}
main();
