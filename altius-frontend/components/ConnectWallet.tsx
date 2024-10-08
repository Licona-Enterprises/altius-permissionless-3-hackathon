import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
// import { polygon } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";

export default function ConnectWallet() {
    const thirdwebClient = createThirdwebClient({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ''
    });

    return (
        <ConnectButton client={thirdwebClient}
          wallets={[
            createWallet("com.coinbase.wallet", {
              walletConfig: {
                options: "smartWalletOnly",
              },
              // chains: [polygon],
            }),
            createWallet("io.metamask"),
            createWallet("me.rainbow")
          ]}
        />
    );
}
