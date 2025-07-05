// Sapphire ParaTime SessionKeyManager contract deployment script
const { ethers } = require('hardhat');

async function main() {
  console.log("🚀 SessionKeyManager contract deploy ediliyor...");
  
  // Network ve accounts kontrol et
  console.log("🔗 Network:", network.name);
  console.log("🔑 Private Key loaded:", process.env.PRIVATE_KEY ? "✅ Yes" : "❌ No");
  
  // Signers'ı kontrol et
  const signers = await ethers.getSigners();
  console.log("👥 Available signers:", signers.length);
  
  if (signers.length === 0) {
    throw new Error("No signers available. Check your private key configuration.");
  }
  
  // Deployer account'unu al
  const [deployer] = signers;
  console.log("👤 Deployer account:", deployer.address);
  
  // Balance kontrol et
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "TEST");
  
  // Contract factory'yi al
  const SessionKeyManager = await ethers.getContractFactory("SessionKeyManager");
  
  // Deploy et
  console.log("📄 Contract deploy ediliyor...");
  const sessionKeyManager = await SessionKeyManager.deploy();
  
  // Deploy işleminin tamamlanmasını bekle
  const deployedContract = await sessionKeyManager.waitForDeployment();
  
  console.log("✅ SessionKeyManager deploy edildi!");
  console.log("📍 Contract adresi:", await sessionKeyManager.getAddress());
  
  const contractAddress = await sessionKeyManager.getAddress();
  
  // Contract'ı verify et (opsiyonel)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("⏳ Contract verify ediliyor...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verify edildi!");
    } catch (error) {
      console.log("❌ Verify hatası:", error.message);
    }
  }
  
  // Environment variables için bilgi
  console.log("\n📝 .env.local dosyasına ekleyecek değerler:");
  console.log(`NEXT_PUBLIC_SAPPHIRE_CONTRACT_${network.name.toUpperCase()}=${contractAddress}`);
  
  // Test için bir app register et
  console.log("\n🧪 Test app register ediliyor...");
  const tx = await sessionKeyManager.registerApp("shadowauth-demo");
  await tx.wait();
  console.log("✅ Test app (shadowauth-demo) register edildi!");
  console.log("👤 App owner:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deploy hatası:", error);
    process.exit(1);
  }); 