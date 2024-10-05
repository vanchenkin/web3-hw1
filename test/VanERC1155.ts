import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { expect } from "chai";

describe("Token contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

        const hardhatToken = await hre.ethers.deployContract("VanERC1155", [owner]);

        return { hardhatToken, owner, addr1, addr2 };
    }

    it("Buy tokens", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

        await hardhatToken.buy({ value: 300 });

        await expect(await hardhatToken.balanceOf(owner, await hardhatToken.MAIN_TOKEN_ID())).to.equal(300);
    });

    it("Mint tokens", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

        await hardhatToken.mint(owner, await hardhatToken.MAIN_TOKEN_ID(), 300, Buffer.from("data"));
        await expect(await hardhatToken.balanceOf(owner, await hardhatToken.MAIN_TOKEN_ID())).to.equal(300);
    });

    it("Mint tokens not owner", async function () {
        const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);

        await expect(
            hardhatToken
                .connect(addr1)
                .mint(owner, await hardhatToken.MAIN_TOKEN_ID(), 300, Buffer.from("data"))
        ).to.reverted;
    });
});
