import {
  HealthStatus,
  InfoResponse,
  MspClient,
  UserInfo,
} from '@storagehub-sdk/msp-client';
import { HttpClientConfig } from '@storagehub-sdk/core';
import { address, walletClient, network } from './clientService.js';

// Configure the HTTP client to point to the MSP backend
const httpCfg: HttpClientConfig = { baseUrl: network.mspUrl };

// Initialize a session token for authenticated requests (updated after authentication
// through SIWE)
let sessionToken: string | undefined = undefined;

// Provide session information to the MSP client whenever available
// Returns a token and user address if authenticated, otherwise undefined
const sessionProvider = async () =>
  sessionToken
    ? ({ token: sessionToken, user: { address: address } } as const)
    : undefined;

// Establish a connection to the Main Storage Provider (MSP) backend
let mspClient: MspClient;

// Initialize MSP client asynchronously
const initializeMspClient = async (): Promise<MspClient> => {
  if (!mspClient) {
    mspClient = await MspClient.connect(httpCfg, sessionProvider);
  }
  return mspClient;
};

// Retrieve MSP metadata, including its unique ID and version, and log it to the console
const getMspInfo = async (): Promise<InfoResponse> => {
  const client = await initializeMspClient();
  const mspInfo = await client.info.getInfo();
  console.log(`MSP ID: ${mspInfo.mspId}`);
  console.log(`MSP Version: ${mspInfo.version || 'N/A'}`);
  return mspInfo;
};

// Retrieve and log the MSP's current health status
const getMspHealth = async (): Promise<HealthStatus> => {
  const client = await initializeMspClient();
  const mspHealth = await client.info.getHealth();
  console.log(`MSP Health: ${mspHealth}`);
  return mspHealth;
};

// Authenticate the user via SIWE (Sign-In With Ethereum) using the connected wallet
// Once authenticated, store the returned session token and retrieve the user's profile
const authenticateUser = async (): Promise<UserInfo | null> => {
  try {
    const client = await initializeMspClient();
    console.log('Authenticating user with MSP via SIWE...');
    
    // Extract domain from MSP URL for SIWE
    const mspUrl = new URL(network.mspUrl);
    const domain = mspUrl.hostname;
    
    // Try SIWE authentication
    const siweSession = await client.auth.SIWE(walletClient, domain);
    console.log('SIWE Session:', siweSession);
    sessionToken = (siweSession as { token: string }).token;
    const profile: UserInfo = await client.auth.getProfile();
    console.log('User Profile:', profile);
    return profile;
  } catch (error: any) {
    console.warn('⚠️  Authentication failed:', error.message || error);
    console.log('💡 Note: Some operations may require authentication.');
    console.log('   You can still use the SDK for non-authenticated operations.\n');
    return null;
  }
};

// Export initialized client and helper functions for use in other modules
export {
  initializeMspClient,
  getMspInfo,
  getMspHealth,
  authenticateUser,
};

