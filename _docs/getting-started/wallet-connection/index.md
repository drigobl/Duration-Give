---
title: Wallet Connection
description: Complete guide to connecting your cryptocurrency wallet to Give Protocol
permalink: /docs/getting-started/wallet-connection/
---

Connecting your cryptocurrency wallet is essential for using Give Protocol. This guide covers everything you need to know about wallet connection, from setup to security best practices.

## Why Connect a Wallet?

Your wallet connection enables you to:
- **Make Donations**: Send cryptocurrency to organizations
- **Receive Funds**: Organizations can receive donations
- **Track Transactions**: View your giving history on-chain
- **Manage Assets**: Control your cryptocurrency holdings
- **Identity Verification**: Prove ownership of your address

## Supported Wallets

Give Protocol supports all major Web3 wallets:

### Browser Extension Wallets
- **MetaMask** (Recommended) - Most popular and user-friendly
- **Coinbase Wallet** - Great for beginners
- **Brave Wallet** - Built into Brave browser
- **Rabby Wallet** - Advanced features for power users

### Mobile Wallets
- **MetaMask Mobile** - iOS and Android
- **Trust Wallet** - Multi-chain support
- **Rainbow Wallet** - Ethereum-focused
- **Coinbase Wallet** - iOS and Android

### WalletConnect Compatible
- **Ledger Live** - Hardware wallet support
- **Trezor Suite** - Hardware wallet support
- **imToken** - Popular in Asia
- **TokenPocket** - Multi-chain wallet

## Setting Up MetaMask (Recommended)

If you don't have a wallet yet, we recommend starting with MetaMask:

### Step 1: Install MetaMask
1. Visit [metamask.io](https://metamask.io)
2. Click "Download" and select your browser
3. Install the extension
4. Pin it to your browser toolbar

### Step 2: Create Your Wallet
1. Click "Get Started"
2. Choose "Create a Wallet"
3. Create a strong password
4. **IMPORTANT**: Write down your recovery phrase
5. Store it securely offline
6. Confirm your recovery phrase

### Step 3: Add Networks
Give Protocol supports multiple networks. Add them to MetaMask:

#### Polygon Network (Recommended for lower fees)
- **Network Name**: Polygon Mainnet
- **RPC URL**: https://polygon-rpc.com
- **Chain ID**: 137
- **Symbol**: MATIC
- **Block Explorer**: https://polygonscan.com

#### Ethereum Mainnet (Already included)
Ethereum is included by default in MetaMask.

## Connecting Your Wallet to Give Protocol

### Step 1: Visit Give Protocol
1. Go to [giveprotocol.org](https://giveprotocol.org)
2. Click "Connect Wallet" in the top right
3. Select your wallet from the list

### Step 2: Authorize Connection
1. Your wallet will open automatically
2. Review the connection request
3. Click "Connect" or "Approve"
4. Select which accounts to connect

### Step 3: Sign Message
1. Give Protocol will request a signature
2. This verifies you own the wallet
3. Click "Sign" in your wallet
4. No gas fees for signing

### Step 4: Choose Network
1. Select your preferred network:
   - **Polygon**: Lower fees, faster transactions
   - **Ethereum**: Higher security, higher fees
2. Switch networks in your wallet if needed

## Wallet Security Best Practices

### Seed Phrase Security
- **Write it down**: Never store digitally
- **Multiple copies**: Store in different secure locations
- **Never share**: Give Protocol will never ask for your seed phrase
- **Test recovery**: Practice restoring your wallet

### Password Protection
- **Strong passwords**: Use unique, complex passwords
- **Auto-lock**: Set wallet to lock when inactive
- **Two-factor**: Enable 2FA where available
- **Regular updates**: Keep wallet software updated

### Transaction Safety
- **Double-check addresses**: Always verify recipient
- **Start small**: Test with small amounts first
- **Network verification**: Ensure you're on the correct network
- **Gas limits**: Don't set gas too low

## Managing Multiple Wallets

You can connect multiple wallets to your Give Protocol account:

1. **Primary Wallet**: Your main wallet for transactions
2. **Secondary Wallets**: Additional wallets for specific purposes
3. **Cold Storage**: Connect view-only for tracking
4. **Multi-sig**: Team wallets for organizations

### Adding Additional Wallets
1. Go to **Settings** → **Wallets**
2. Click "Add Wallet"
3. Follow the connection process
4. Label each wallet for easy identification

## Troubleshooting Common Issues

### Wallet Won't Connect
1. **Refresh the page** and try again
2. **Check wallet is unlocked** and on correct network
3. **Clear browser cache** and cookies
4. **Disable other wallet extensions** temporarily
5. **Try incognito/private browsing** mode

### Wrong Network
1. **Check network in wallet** matches Give Protocol
2. **Switch networks** in your wallet
3. **Add custom networks** if missing
4. **Refresh the page** after switching

### Transaction Stuck
1. **Check network congestion** on block explorers
2. **Increase gas price** for faster confirmation
3. **Wait for congestion to clear**
4. **Cancel and retry** if possible

### Insufficient Funds
1. **Check gas token balance** (ETH/MATIC)
2. **Get gas tokens** from exchanges
3. **Use faucets** for testnets
4. **Switch to lower-fee network**

## Network Fees and Gas

### Understanding Gas
- **Gas**: Unit of computational work
- **Gas Price**: Cost per unit of gas
- **Gas Limit**: Maximum gas for transaction
- **Total Fee**: Gas Used × Gas Price

### Fee Comparison
| Network | Typical Fee | Speed | Best For |
|---------|-------------|-------|----------|
| Polygon | $0.01-0.10 | Fast | Small donations |
| Ethereum | $5-50 | Variable | Large donations |

### Reducing Fees
- **Use Polygon** for lower fees
- **Time transactions** during low congestion
- **Batch transactions** when possible
- **Adjust gas price** based on urgency

## Advanced Features

### Hardware Wallet Integration
For maximum security, use hardware wallets:

1. **Ledger**: Connect via Ledger Live
2. **Trezor**: Use Trezor Suite
3. **WalletConnect**: Bridge to hardware wallets
4. **Confirmation**: Always verify on device screen

### Multi-Signature Wallets
For organizations requiring multiple approvals:

1. **Gnosis Safe**: Popular multi-sig solution
2. **Setup**: Define signers and threshold
3. **Integration**: Connect via WalletConnect
4. **Governance**: Manage permissions

## Wallet Backup and Recovery

### Before You Need It
- **Backup seed phrase** in multiple secure locations
- **Test recovery process** with small amounts
- **Document wallet addresses** and labels
- **Keep software updated**

### If You Lose Access
1. **Don't panic** - funds are safe with seed phrase
2. **Install wallet** on new device
3. **Import using seed phrase**
4. **Re-add custom networks** and tokens
5. **Update connected apps**

## Need Help?

If you're having trouble with wallet connection:

- **Check our [FAQ](/docs/help-center/faq/)** for common issues
- **Visit [Help Center](/docs/help-center/)** for support
- **Contact support** at support@giveprotocol.org
- **Join our [Community](/docs/community/)** for peer help

## Next Steps

Once your wallet is connected:

1. **[Explore the Dashboard](/docs/getting-started/dashboard/)** - Learn the interface
2. **[Make Your First Donation](/docs/getting-started/first-steps/)** - Start giving
3. **[Browse Organizations](/docs/platform-features/search-discovery/)** - Find causes
4. **[Understand Fees](/docs/technical/fees/)** - Know the costs

Remember: Your wallet is your responsibility. Keep it secure, backup your seed phrase, and never share your private keys with anyone.
