import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { expect } from "chai";

describe("Token contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

        const hardhatToken = await hre.ethers.deployContract("VanERC721", [owner]);

        return { hardhatToken, owner, addr1, addr2 };
    }

    it("Buy tokens", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

        await hardhatToken.buy();

        await expect(await hardhatToken.balanceOf(owner)).to.equal(1);
    });

    it("Mint tokens", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

        await hardhatToken.safeMint(owner, 1);
        await expect(await hardhatToken.balanceOf(owner)).to.equal(1);
    });

    it("Mint tokens not owner", async function () {
        const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);

        await expect(hardhatToken.connect(addr1).safeMint(addr1, 1)).to.reverted;
    });
});
