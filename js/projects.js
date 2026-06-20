/* ============================================================================
   projects.js — curated showcase data + full registry
   All descriptions are grounded in real repo/READMEs. Authorship is framed
   honestly ("work on / contributions / fork / tooling around").
   ========================================================================== */

const ECOSYSTEMS = {
  solana: {
    key: "solana",
    index: "01",
    name: "Solana",
    accent: "--sol",
    tagline: "Validator clients, gossip, and network telemetry.",
    blurb:
      "Most of what I do now. I run and patch the Rust validator clients, reimplemented the " +
      "gossip protocol from the spec, and built a set of tools that measure the network: " +
      "latency, vote credits, block production, leader timing, skip rates.",
    projects: [
      { name: "Agave", role: "Client", lang: "Rust",
        desc: "Custom builds, patches, and instrumentation on Anza's Agave, the main Rust validator client." },
      { name: "Jito-Solana", role: "MEV Fork", lang: "Rust", href: "https://github.com/liquid369/jito-solana",
        desc: "Jito's MEV client. Block-engine, relayer, and bundle workflows for searcher-aware block building." },
      { name: "Alpenglow", role: "Consensus R&D", lang: "Rust",
        desc: "Testing Alpenglow, Solana's Tower BFT replacement." },
      { name: "Gossip", role: "Protocol Impl", lang: "Rust",
        desc: "Standalone implementation of Solana's gossip (CRDS) protocol, written from the spec." },
      { name: "Gossip Spy + Viz", role: "Tooling", lang: "Rust · JS",
        desc: "Crawler and visualizer for the validator gossip network, updated live." },
      { name: "BAM Client", role: "Client", lang: "Rust",
        desc: "Client work for Jito's BAM (Block Assembly Marketplace)." },
      { name: "Block-Production Monitor", role: "Telemetry", lang: "Rust",
        desc: "Skip-rate and block-production tracking built on matsuro-hadouken's blocks-production-lib. Writes to Postgres for analysis." },
      { name: "DoubleZero Calc", role: "Tool", lang: "Vue",
        desc: "Economics calculator for DoubleZero, the dedicated-fiber network. Models its effect on validator performance and rewards." },
      { name: "Latency Tracker", role: "Telemetry", lang: "Rust",
        desc: "Measures validator and vote latency across the cluster and feeds the dashboards." },
      { name: "Credit + CU Exporters", role: "Telemetry", lang: "Rust",
        desc: "Prometheus exporters for vote credits and compute units." },
      { name: "Blueshift Programs", role: "On-chain", lang: "Anchor",
        desc: "Anchor escrow and vault programs from the Blueshift course." },
      { name: "Epoch + Leader Inspectors", role: "Analysis", lang: "Rust",
        desc: "Inspectors for per-epoch performance, leader-slot timing, lockouts, and missed votes." },
    ],
  },

  pivx: {
    key: "pivx",
    index: "02",
    name: "PIVX",
    accent: "--pivx",
    tagline: "Core full node, shielded payments, and wallets.",
    blurb:
      "I've contributed to the PIVX C++ full node and the tools around it for years. " +
      "Sapling SHIELD privacy, cold-staking, masternode governance, and the wallets, " +
      "explorers, and payment rails on top.",
    projects: [
      { name: "PIVX Core", role: "Core", lang: "C++", href: "https://github.com/liquid369/PIVX",
        desc: "Privacy, cold-staking, deterministic masternodes, and on-chain governance, in the C++ full node." },
      { name: "MyPIVXWallet", role: "Wallet", lang: "JavaScript", href: "https://github.com/liquid369/MyPIVXWallet",
        desc: "Browser-based PIVX wallet. Keys stay on the device, handles SHIELD." },
      { name: "pivx-walletd", role: "Service", lang: "Rust", href: "https://github.com/liquid369/pivx-walletd",
        desc: "Stateless Sapling (SHIELD) address-derivation service. Lets a payment processor take shielded receipts without a hot wallet." },
      { name: "rusty-blox", role: "Explorer", lang: "Rust", href: "https://github.com/liquid369/rusty-blox",
        desc: "PIVX block explorer and indexer, written in Rust from scratch." },
      { name: "PET4L", role: "Recovery", lang: "Python", href: "https://github.com/liquid369/PET4L",
        desc: "PIVX Emergency Tool for Ledger. Spends PIV from a Ledger that the official path can't recover." },
      { name: "PIVX-SPMT", role: "Masternodes", lang: "Python", href: "https://github.com/liquid369/PIVX-SPMT",
        desc: "Secure PIVX Masternode Tool. Set up and run masternodes with collateral on a hardware wallet." },
      { name: "BTCPay PIVX Plugin", role: "Payments", lang: "C#", href: "https://github.com/liquid369/btcpayserver-pivx-plugin",
        desc: "PIVX payments for BTCPay Server over direct pivxd RPC. Transparent and Sapling-shielded invoices." },
      { name: "pivx-rpc-rs + Crawler", role: "Tooling", lang: "Rust",
        desc: "Rust RPC bindings, plus a crawler that maps the PIVX peer graph and quorum health." },
      { name: "testnet6 / LLMQ Ansible", role: "Infra", lang: "Ansible",
        desc: "Ansible automation for PIVX Testnet6 quorum and LLMQ testing. Spins up consensus experiments." },
    ],
  },

  chains: {
    key: "chains",
    index: "03",
    name: "Blockchains",
    accent: "--chain",
    tagline: "Bitcoin-family, Substrate, Ethereum, wallets, pools.",
    blurb:
      "Ten years of chains, plenty of them dead now. Bitcoin tooling and explorers, " +
      "multi-currency wallets, Substrate nodes and relayers, an Ethereum light client, " +
      "mining pools, Nostr clients, and a pile of altcoin forks.",
    projects: [
      { name: "Cake Wallet", role: "Wallet", lang: "Dart", href: "https://github.com/liquid369/cake_wallet",
        desc: "Contributions to Cake Wallet, the noncustodial wallet behind Cake and Monero.com." },
      { name: "BTCPay Server", role: "Payments", lang: "C#", href: "https://github.com/liquid369/btcpayserver",
        desc: "Self-hosted, BitPay-compatible payment processor. I wrote the plugins that add new chains." },
      { name: "Blockbook", role: "Backend", lang: "Go", href: "https://github.com/liquid369/blockbook",
        desc: "Trezor's address and balance backend. Multi-coin indexing, adapted for more networks." },
      { name: "ElectrumX", role: "Server", lang: "Python", href: "https://github.com/liquid369/electrumx-1",
        desc: "The ElectrumX server backend, reconfigured to index non-Bitcoin chains." },
      { name: "NBitcoin + NBXplorer", role: "Library", lang: "C#", href: "https://github.com/liquid369/NBXplorer",
        desc: "The .NET Bitcoin library and its UTXO explorer. BTCPay sits on top of both." },
      { name: "GGX (Golden Gate)", role: "Node", lang: "Rust", href: "https://github.com/liquid369/ggxnode",
        desc: "Substrate-based cross-chain node, runtime, and relayer work." },
      { name: "ETH2 Light Client", role: "Pallet", lang: "Rust", href: "https://github.com/liquid369/pallet-eth2-light-client",
        desc: "Substrate pallet implementing an Ethereum beacon-chain light client." },
      { name: "bitcoinjs / bitcoinj", role: "Library", lang: "JS · Java",
        desc: "Bitcoin libraries in JavaScript and Java. Transaction building, signing, key handling." },
      { name: "yiimp + miningcore", role: "Pools", lang: "PHP · C#",
        desc: "Multi-algo mining-pool engines. Stratum, payouts, and keeping a pool online." },
      { name: "Chatstr + blink", role: "Nostr", lang: "JS",
        desc: "Nostr clients and experiments on the open messaging protocol." },
    ],
  },
};

/* ----------------------------------------------------------------------------
   Full registry — the long tail. Every meaningful local project, categorized.
   cat: solana | pivx | bitcoin | substrate | lab
   -------------------------------------------------------------------------- */
const REGISTRY = [
  // --- Solana ecosystem ---
  ["agave", "solana"], ["agave2", "solana"], ["agave-status-cache", "solana"],
  ["jito-solana", "solana"], ["jito2", "solana"], ["jito-relayer", "solana"],
  ["alpenglow", "solana"], ["alpenglow1", "solana"], ["jsol", "solana"], ["jsol3", "solana"],
  ["paladin-solana", "solana"], ["stakenet", "solana"], ["stakeskip", "solana"],
  ["gossip", "solana"], ["gossip-spy", "solana"], ["gossip-viz", "solana"], ["spy-gossip", "solana"],
  ["sol-crawler", "solana"], ["sol-vote-crawler", "solana"], ["sol-censor", "solana"], ["sol-rank-finder", "solana"],
  ["bam-client", "solana"], ["bam-test", "solana"], ["mods-bam", "solana"],
  ["doublezero-calc", "solana"], ["dz_validator_calc", "solana"],
  ["blocks-production-lib", "solana"], ["solana-pools-data-lib", "solana"], ["pool-breakdown", "solana"], ["pools-lib-smoke", "solana"],
  ["latency-tracker", "solana"], ["latency-check", "solana"], ["lat-check", "solana"], ["latency_backend", "solana"], ["latency_ui", "solana"],
  ["testnet-latency-dash", "solana"], ["sol-testnet-latency", "solana"], ["sol-testnet-parser", "solana"], ["testnet-latency", "solana"], ["shit-latency", "solana"],
  ["vote-latency", "solana"], ["vote-latency-ui", "solana"], ["vote-monitor-backend", "solana"], ["vote-cu", "solana"], ["vote-interface", "solana"], ["vote-pcap-analyzer", "solana"], ["votalizer", "solana"], ["sol-votes", "solana"],
  ["credit-exporter", "solana"], ["cu-exporter", "solana"], ["cu-inspector", "solana"], ["sol-credits", "solana"], ["sol-db-credits", "solana"], ["val-credit-comp", "solana"],
  ["epoch-inspector", "solana"], ["epoch-timing", "solana"], ["lead-check", "solana"], ["lead-inspector", "solana"], ["lead-print", "solana"], ["sol-leader", "solana"], ["solana-leader-dashboard", "solana"], ["block-time-leader", "solana"], ["slow-leaderboard", "solana"],
  ["lockout-check", "solana"], ["missed-vote", "solana"], ["slot_validator", "solana"], ["slot-ingest", "solana"], ["slow-blocks", "solana"], ["sol-val-slots", "solana"],
  ["shred-parser", "solana"], ["sol-failover", "solana"], ["sol-feat", "solana"], ["sol-income-tx", "solana"], ["sol-swap-tracker", "solana"], ["sol-vol-tracker", "solana"], ["val-tpu-ip-check", "solana"], ["vali-ddos", "solana"], ["validator-mods", "solana"], ["mods-ag", "solana"],
  ["blueshift_anchor_escrow", "solana"], ["blueshift_anchor_vault", "solana"], ["blueshift_vault", "solana"],
  ["solana-sdk", "solana"], ["solana-sdk-221", "solana"], ["solana-sha256-hasher-optimized", "solana"], ["solana-validator-config-data-lib", "solana"], ["solana-a3mc-api-ui", "solana"], ["solana-sleep-well", "solana"], ["sleepy-ui", "solana"], ["sleepy2", "solana"], ["sol-latency-ui", "solana"], ["vesting-ui", "solana"],
  ["archive-registry", "solana"], ["backfill-db", "solana"], ["cluster-ip", "solana"], ["allnodes", "solana"], ["svcdl-smoke", "solana"], ["tds-slowpoke", "solana"], ["nework-exporter", "solana"], ["keysearch", "solana"], ["income_stream", "solana"],

  // --- PIVX ecosystem ---
  ["PIVX", "pivx"], ["MyPIVXWallet", "pivx"], ["PIVX-WebWallet", "pivx"], ["pivx-walletd", "pivx"],
  ["rusty-blox", "pivx"], ["PIVX-BlockExplorer", "pivx"], ["PIVX-Crawler", "pivx"], ["pivx-checker", "pivx"],
  ["PET4L", "pivx"], ["liq-pet4l", "pivx"], ["PIVX-SPMT", "pivx"], ["spmt", "pivx"],
  ["pivx-rpc-rs", "pivx"], ["pivx-ansible", "pivx"], ["testnet6-ansible", "pivx"], ["btcpayserver-pivx-plugin", "pivx"],
  ["pivx-activity", "pivx"], ["pivx-binaries", "pivx"], ["pivx-detached-sigs", "pivx"], ["DSW", "pivx"], ["SAPP", "pivx"],

  // --- Bitcoin / other chains ---
  ["cake_wallet", "bitcoin"], ["btcpayserver", "bitcoin"], ["btcpayserver-zcash-plugin", "bitcoin"],
  ["blockbook", "bitcoin"], ["blockbook-new", "bitcoin"], ["electrum", "bitcoin"], ["electrumx", "bitcoin"],
  ["NBitcoin", "bitcoin"], ["NBXplorer", "bitcoin"], ["bitcoinj", "bitcoin"], ["bitcoinjs-lib", "bitcoin"], ["bitcoin-reference", "bitcoin"],
  ["cannabiscoin", "bitcoin"], ["core", "bitcoin"], ["crawl", "bitcoin"], ["ethpair", "bitcoin"], ["vls", "bitcoin"],
  ["Chatstr", "bitcoin"], ["blink", "bitcoin"], ["x-discord", "bitcoin"],

  // --- Substrate / cross-chain ---
  ["ggx", "substrate"], ["ggxnode", "substrate"], ["ggxruntime", "substrate"], ["ggxrelayer", "substrate"],
  ["ggx-doc", "substrate"], ["ggx-telemetry", "substrate"], ["liqggx", "substrate"], ["polkadot-sdk", "substrate"],
  ["pallet-eth2-light-client", "substrate"], ["transaction-receipt-relayer", "substrate"], ["throttled-json-rpc-rs", "substrate"], ["abrakadabra", "substrate"],

  // --- Lab / misc ---
  ["Multix", "lab"], ["multisig", "lab"], ["Vector", "lab"], ["Bagels", "lab"],
  ["log-formatter", "lab"], ["log-parse", "lab"], ["toml-parse", "lab"], ["test-parser", "lab"], ["prop_csv", "lab"],
  ["pubsub", "lab"], ["gitian-builder", "lab"], ["local-nuget", "lab"], ["art3mis-website", "lab"], ["gajim-client", "lab"],
];

const REGISTRY_FILTERS = [
  { key: "all", label: "All" },
  { key: "solana", label: "Solana" },
  { key: "pivx", label: "PIVX" },
  { key: "bitcoin", label: "Bitcoin & Other" },
  { key: "substrate", label: "Substrate" },
  { key: "lab", label: "Lab" },
];

const MARQUEE = [
  "RUST", "C++", "SOLANA", "ANCHOR", "AGAVE", "GOSSIP / CRDS", "SAPLING SHIELD",
  "SUBSTRATE", "GO", "C#", "PYTHON", "DART", "MASTERNODES", "MEV / JITO",
  "VALIDATOR OPS", "BLOCK EXPLORERS", "PROMETHEUS", "POSTGRES", "NOSTR", "BTCPAY",
];

const STATS = [
  { value: REGISTRY.length, suffix: "+", label: "Projects" },
  { value: 82, suffix: "+", label: "Public repos" },
  { value: 3, suffix: "", label: "Core ecosystems" },
  { value: 9, suffix: "+", label: "Languages" },
];
