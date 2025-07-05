const { ethers } = require('ethers');

async function generateTestWallet() {
  console.log("🔐 Test cüzdanı oluşturuluyor...");
  
  // Rastgele cüzdan oluştur
  const wallet = ethers.Wallet.createRandom();
  
  console.log("✅ Test cüzdanı oluşturuldu!");
  console.log("📍 Address:", wallet.address);
  console.log("🔑 Private Key:", wallet.privateKey);
  console.log("📝 Mnemonic:", wallet.mnemonic.phrase);
  
  console.log("\n📋 .env.local dosyasına ekleyecek değer:");
  console.log(`PRIVATE_KEY=${wallet.privateKey}`);
  
  console.log("\n⚠️  UYARI: Bu private key'i sadece test için kullanın!");
  console.log("💰 Faucet'tan TEST token almak için: https://faucet.testnet.oasis.io");
  console.log("🏦 Address'inize TEST token gönderin:", wallet.address);
}

generateTestWallet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Hata:", error);
    process.exit(1);
  }); 