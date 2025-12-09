import apiClient from './apiClient';

export interface Wallet {
  userId: string;
  balance: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InitWalletResponse {
  message: string;
  wallet: Wallet;
}

export interface TransactionResponse {
  description: string;
  userId: string;
  newBalance: number;
}

export interface BalanceResponse {
  userId: string;
  balance: number;
}

export const walletApi = {
  /**
   * Initialize a wallet for a user
   */
  initWallet: async (userId: string) => {
    const response = await apiClient.post<InitWalletResponse>('/wallet/init', { userId });
    return response.data;
  },

  /**
   * Reward coins to a user
   */
  rewardCoin: async (userId: string, amount: number, description?: string) => {
    const response = await apiClient.post<TransactionResponse>(`/wallet/reward/${userId}`, { amount, description });
    return response.data;
  },

  /**
   * Deduct coins from a user (penalty)
   */
  penaltyCoin: async (userId: string, amount: number, description?: string) => {
    const response = await apiClient.post<TransactionResponse>(`/wallet/penalty/${userId}`, { amount, description });
    return response.data;
  },

  /**
   * Get current wallet balance
   */
  getBalance: async (userId: string) => {
    const response = await apiClient.get<BalanceResponse>(`/wallet/balance/${userId}`);
    return response.data;
  }
};
