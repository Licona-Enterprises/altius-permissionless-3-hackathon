const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenTransferor_v1_Module", (m) => {

    const s_router = m.getParameter("s_router", "0xF694E193200268f9a4868e4Aa017A0118C9a8177");
    const s_linkToken = m.getParameter("s_linkToken", "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846");
  
    const tokenTransferor = m.contract("TokenTransferor_v1", [s_router, s_linkToken], {
    });
  
    return { tokenTransferor };

});

