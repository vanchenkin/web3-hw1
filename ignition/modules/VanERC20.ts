import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenModule = buildModule("VanERC20Module", (m) => {
    const token = m.contract("VanERC20", ["0x6FDb46ECeF33Ae4B938662Ac260E47F21AD681F4"]);

    return { token };
});

export default TokenModule;
