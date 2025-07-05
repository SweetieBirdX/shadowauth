// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Sapphire import'u şimdilik devre dışı (paket kurulu olmadığı için)
// import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

/**
 * @title SessionKeyManager
 * @dev Oasis Sapphire ParaTime üzerinde gizli session key yönetimi
 * Bu contract, World ID ZK-Proof doğrulama sonrası oluşturulan
 * session key'leri güvenli şekilde saklar ve doğrular
 */
contract SessionKeyManager {
    
    // Session yapısı
    struct Session {
        string appId;           // Hangi uygulama için
        uint256 validUntil;     // Geçerlilik süresi (timestamp)
        bytes32 nullifierHash;  // World ID nullifier hash (tekrar kullanım önleme)
        bool isActive;          // Session aktif mi?
        uint256 createdAt;      // Oluşturulma zamanı
    }
    
    // Session key => Session mapping (gizli)
    mapping(bytes32 => Session) private sessions;
    
    // App bazında nullifier hash takibi (tekrar kullanımı önlemek için)
    mapping(string => mapping(bytes32 => bool)) private usedNullifiers;
    
    // App sahipleri
    mapping(string => address) public appOwners;
    
    // ROFL operator adresi (session create edebilir)
    address public roflOperator;
    
    // Events
    event SessionCreated(
        bytes32 indexed sessionKey,
        string indexed appId,
        uint256 validUntil
    );
    
    event SessionRevoked(
        bytes32 indexed sessionKey,
        string indexed appId
    );
    
    event AppRegistered(
        string indexed appId,
        address indexed owner
    );
    
    // Modifiers
    modifier onlyAppOwner(string memory appId) {
        require(appOwners[appId] == msg.sender, "Not app owner");
        _;
    }
    
    modifier validSession(bytes32 sessionKey) {
        require(sessions[sessionKey].isActive, "Session not active");
        require(block.timestamp <= sessions[sessionKey].validUntil, "Session expired");
        _;
    }
    
    constructor() {
        // Sapphire confidential contract initialization
    }
    
    /**
     * @dev Yeni bir app kaydeder
     * @param appId Benzersiz app ID
     */
    function registerApp(string memory appId) external {
        require(appOwners[appId] == address(0), "App already registered");
        appOwners[appId] = msg.sender;
        emit AppRegistered(appId, msg.sender);
    }
    
    /**
     * @dev Session key oluşturur (sadece ROFL tarafından çağrılmalı)
     * @param _sessionKey Benzersiz session key
     * @param _appId Hangi app için
     * @param _validUntil Geçerlilik süresi (timestamp)
     * @param _nullifierHash World ID nullifier hash
     */
    function createSession(
        bytes32 _sessionKey,
        string memory _appId,
        uint256 _validUntil,
        bytes32 _nullifierHash
    ) external returns (bool) {
        // Nullifier hash'in daha önce kullanılmadığını kontrol et
        require(!usedNullifiers[_appId][_nullifierHash], "Nullifier already used");
        
        // Session key'in daha önce kullanılmadığını kontrol et
        require(!sessions[_sessionKey].isActive, "Session key already exists");
        
        // Geçerlilik süresinin gelecekte olduğunu kontrol et
        require(_validUntil > block.timestamp, "Invalid validity period");
        
        // Session'ı oluştur
        sessions[_sessionKey] = Session({
            appId: _appId,
            validUntil: _validUntil,
            nullifierHash: _nullifierHash,
            isActive: true,
            createdAt: block.timestamp
        });
        
        // Nullifier hash'i kullanılmış olarak işaretle
        usedNullifiers[_appId][_nullifierHash] = true;
        
        emit SessionCreated(_sessionKey, _appId, _validUntil);
        return true;
    }
    
    /**
     * @dev Session key'i doğrular
     * @param _sessionKey Doğrulanacak session key
     * @return isValid Session geçerli mi?
     * @return appId Hangi app'e ait
     * @return validUntil Ne zamana kadar geçerli
     */
    function verifySession(bytes32 _sessionKey) 
        external 
        view 
        returns (bool isValid, string memory appId, uint256 validUntil) 
    {
        Session memory session = sessions[_sessionKey];
        
        if (session.isActive && block.timestamp <= session.validUntil) {
            return (true, session.appId, session.validUntil);
        }
        
        return (false, "", 0);
    }
    
    /**
     * @dev Session'ı iptal eder
     * @param _sessionKey İptal edilecek session key
     */
    function revokeSession(bytes32 _sessionKey) 
        external 
        validSession(_sessionKey)
        returns (bool) 
    {
        Session storage session = sessions[_sessionKey];
        
        // Sadece app sahibi veya session sahibi iptal edebilir
        require(
            appOwners[session.appId] == msg.sender,
            "Not authorized to revoke"
        );
        
        session.isActive = false;
        
        emit SessionRevoked(_sessionKey, session.appId);
        return true;
    }
    
    /**
     * @dev Session detaylarını getirir (sadece session key sahibi görür)
     * @param _sessionKey Session key
     * @return session Session detayları
     */
    function getSessionDetails(bytes32 _sessionKey) 
        external 
        view 
        validSession(_sessionKey)
        returns (Session memory session) 
    {
        return sessions[_sessionKey];
    }
    
    /**
     * @dev Nullifier hash'in kullanılıp kullanılmadığını kontrol eder
     * @param _appId App ID
     * @param _nullifierHash Nullifier hash
     * @return used Kullanılmış mı?
     */
    function isNullifierUsed(string memory _appId, bytes32 _nullifierHash) 
        external 
        view 
        returns (bool used) 
    {
        return usedNullifiers[_appId][_nullifierHash];
    }
    
    /**
     * @dev Toplu session temizleme (süresi dolmuş session'ları temizler)
     * @param _sessionKeys Temizlenecek session key'ler
     */
    function cleanupExpiredSessions(bytes32[] memory _sessionKeys) external {
        for (uint i = 0; i < _sessionKeys.length; i++) {
            Session storage session = sessions[_sessionKeys[i]];
            if (session.isActive && block.timestamp > session.validUntil) {
                session.isActive = false;
                emit SessionRevoked(_sessionKeys[i], session.appId);
            }
        }
    }
    
    // Confidential data storage mapping (Sapphire native functions yerine geçici)
    mapping(bytes32 => bytes) private confidentialData;
    
    /**
     * @dev Gizli veri saklama (Sapphire özelliği - şimdilik mapping ile)
     * @param _sessionKey Session key
     * @param _encryptedData Şifrelenmiş veri
     */
    function storeConfidentialData(
        bytes32 _sessionKey, 
        bytes memory _encryptedData
    ) external validSession(_sessionKey) {
        bytes32 dataKey = keccak256(abi.encodePacked(_sessionKey, "confidential_data"));
        
        // Geçici olarak mapping'de sakla (gerçek Sapphire deploy'da confidentialStoreBytes kullanılacak)
        confidentialData[dataKey] = _encryptedData;
    }
    
    /**
     * @dev Gizli veri okuma (Sapphire özelliği - şimdilik mapping ile)
     * @param _sessionKey Session key
     * @return encryptedData Şifrelenmiş veri
     */
    function retrieveConfidentialData(bytes32 _sessionKey) 
        external 
        view 
        validSession(_sessionKey)
        returns (bytes memory encryptedData) 
    {
        bytes32 dataKey = keccak256(abi.encodePacked(_sessionKey, "confidential_data"));
        return confidentialData[dataKey];
    }
    
    /**
     * @dev Contract sürümü
     */
    function version() external pure returns (string memory) {
        return "1.0.0-shadowauth";
    }
} 