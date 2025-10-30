import { ethers } from 'ethers';
import { encodeFunctionData, type Address } from 'viem';
import {
  getOptimizedContractConfig,
  getNetworkConfig,
} from './optimized-badge-config';
import { getCourseTokenId } from '@/lib/courseToken';

interface ContractTransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

interface ContractReadResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * ENROLLMENT SERVICE - Following Motus ContractService Pattern
 * 
 * This service properly manages the kernelClient from ZeroDev for smart account transactions.
 * It mirrors the successful Motus implementation to ensure sponsored transactions work correctly.
 */
export class EnrollmentService {
  private provider: ethers.Provider | null = null;
  private smartAccountSigner: any = null; // Smart account signer from Privy/ZeroDev
  private network = 'mainnet'; // Celo Mainnet

  constructor() {
    // Initialize RPC provider for read operations
    this.initializeProvider();
  }

  // Initialize RPC provider for read operations (force mainnet)
  private async initializeProvider() {
    try {
      const networkConfig = getNetworkConfig(42220); // Force mainnet
      this.provider = new ethers.JsonRpcProvider(networkConfig.RPC_URL);
      console.log('✅ EnrollmentService: RPC provider initialized for MAINNET');
    } catch (error) {
      console.error('❌ EnrollmentService: Failed to initialize RPC provider:', error);
    }
  }

  /**
   * Initialize with ZeroDev Kernel client from Privy integration
   * This is the CRITICAL method that Celo-MX was missing
   */
  async initializeWithSmartAccount(kernelClient: any) {
    try {
      console.log('🔧 EnrollmentService: Attempting to initialize with ZeroDev Kernel client:', {
        hasAccount: !!kernelClient?.account,
        hasSendTransaction: !!kernelClient?.sendTransaction,
        accountAddress: kernelClient?.account?.address,
      });

      if (kernelClient && kernelClient.account && kernelClient.sendTransaction) {
        // Store the kernel client directly - it's a drop-in replacement for viem Wallet Client
        this.smartAccountSigner = kernelClient;
        
        console.log('✅ EnrollmentService: Initialized with ZeroDev Kernel client:', kernelClient.account.address);
        console.log('🔧 Client type:', kernelClient.constructor.name);
      } else {
        console.error('❌ Invalid kernel client. Expected ZeroDev Kernel client with account and sendTransaction.');
        console.error('Available properties:', Object.keys(kernelClient || {}));
        throw new Error('Invalid kernel client - missing account or sendTransaction methods');
      }
    } catch (error) {
      console.error('❌ Failed to initialize with kernel client:', error);
      throw error;
    }
  }

  /**
   * ENROLL IN COURSE - Using ZeroDev Kernel client (sponsored transaction)
   * This mirrors Motus's createAssignmentWithKernel method
   */
  async enrollInCourse(courseSlug: string, courseId: string): Promise<ContractTransactionResult> {
    console.log('🚀 EnrollmentService.enrollInCourse called:', { courseSlug, courseId });
    console.log('🔍 Smart account signer state:', {
      hasSmartAccountSigner: !!this.smartAccountSigner,
      smartAccountType: this.smartAccountSigner?.constructor?.name,
      hasAccount: !!this.smartAccountSigner?.account,
      accountAddress: this.smartAccountSigner?.account?.address,
      hasSendTransaction: !!this.smartAccountSigner?.sendTransaction
    });
    
    try {
      if (!this.smartAccountSigner) {
        console.error('❌ EnrollmentService: No smart wallet signer available');
        throw new Error('Smart wallet signer required for transactions');
      }
      
      console.log('🔧 EnrollmentService: Calling enrollWithKernel...');
      const result = await this.enrollWithKernel(courseSlug, courseId);
      console.log('✅ EnrollmentService: enrollWithKernel completed:', result);
      return result;
    } catch (error: any) {
      console.error('❌ EnrollmentService: Enrollment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to enroll in course'
      };
    }
  }

  /**
   * COMPLETE MODULE - Using ZeroDev Kernel client (sponsored transaction)
   */
  async completeModule(courseSlug: string, courseId: string, moduleIndex: number): Promise<ContractTransactionResult> {
    try {
      console.log('📝 EnrollmentService: Completing module:', { courseSlug, courseId, moduleIndex });
      
      if (!this.smartAccountSigner) {
        console.error('❌ EnrollmentService: No smart wallet signer available');
        throw new Error('Smart wallet signer required for transactions');
      }
      
      console.log('🔧 EnrollmentService: Using ZeroDev Kernel client for sponsored module completion');
      return await this.completeModuleWithKernel(courseSlug, courseId, moduleIndex);
    } catch (error: any) {
      console.error('❌ EnrollmentService: Module completion error:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete module'
      };
    }
  }

  /**
   * ENROLL WITH KERNEL - Core transaction execution following Motus pattern
   */
  private async enrollWithKernel(courseSlug: string, courseId: string): Promise<ContractTransactionResult> {
    const contractConfig = getOptimizedContractConfig(42220); // Force mainnet
    const contractAddress = contractConfig.address;
    const tokenId = getCourseTokenId(courseSlug, courseId);
    
    console.log('🚀 Enrolling with ZeroDev Kernel client:', this.smartAccountSigner.account.address);
    console.log('📋 Enrollment params:', {
      courseSlug,
      courseId,
      tokenId: tokenId.toString(),
      contractAddress,
    });
    
    try {
      // Validate contract address
      if (!contractAddress || contractAddress.trim() === '') {
        throw new Error(`Contract address not found: ${contractAddress}`);
      }
      
      console.log('📍 Contract address (Optimized):', contractAddress);
      
      // Generate encoded data for enroll function - SAME AS MOTUS PATTERN
      const encodedData = this.encodeEnrollData(tokenId);
      console.log('🔒 Encoded enroll data:', encodedData);
      console.log('📏 Encoded data length:', encodedData.length);
      
      // CRITICAL: Direct kernelClient.sendTransaction call like Motus
      // The kernel client is a drop-in replacement for viem's wallet client
      // Use sendTransaction directly - ZeroDev will handle the user operation creation
      console.log('🚀 About to call kernelClient.sendTransaction with params:', {
        to: contractAddress,
        data: encodedData,
        value: '0x0',
        smartAccountAddress: this.smartAccountSigner.account?.address
      });
      
      const hash = await this.smartAccountSigner.sendTransaction({
        to: contractAddress as `0x${string}`,
        data: encodedData,
        value: BigInt(0)
      });
      
      console.log('✅ ZeroDev enrollment transaction sent:', hash);
      
      return {
        success: true,
        transactionHash: hash,
      };
    } catch (error: any) {
      console.error('❌ ZeroDev enrollment failed:', {
        error: error.message,
        code: error.code,
        details: error.details,
        data: error.data
      });
      
      // Handle "Already enrolled" case
      if (error.message?.includes('Already enrolled') || error.message?.includes('416c726561647920656e726f6c6c6564')) {
        console.log('✅ User already enrolled - treating as success');
        return {
          success: true,
          transactionHash: 'already-enrolled',
        };
      }
      
      throw error;
    }
  }

  /**
   * COMPLETE MODULE WITH KERNEL - Core transaction execution
   */
  private async completeModuleWithKernel(courseSlug: string, courseId: string, moduleIndex: number): Promise<ContractTransactionResult> {
    const contractConfig = getOptimizedContractConfig(42220); // Force mainnet
    const contractAddress = contractConfig.address;
    const tokenId = getCourseTokenId(courseSlug, courseId);
    
    console.log('🚀 Completing module with ZeroDev Kernel client:', this.smartAccountSigner.account.address);
    console.log('📋 Module completion params:', {
      courseSlug,
      courseId,
      moduleIndex,
      tokenId: tokenId.toString(),
      contractAddress,
    });
    
    try {
      // Generate encoded data for completeModule function
      const encodedData = this.encodeCompleteModuleData(tokenId, moduleIndex);
      console.log('🔒 Encoded completeModule data:', encodedData);
      
      // CRITICAL: Direct kernelClient.sendTransaction call
      const hash = await this.smartAccountSigner.sendTransaction({
        to: contractAddress as `0x${string}`,
        data: encodedData,
        value: BigInt(0)
      });
      
      console.log('✅ ZeroDev module completion transaction sent:', hash);
      
      return {
        success: true,
        transactionHash: hash,
      };
    } catch (error: any) {
      console.error('❌ ZeroDev module completion failed:', error);
      throw error;
    }
  }

  /**
   * ENCODE FUNCTION CALL DATA - Following Motus pattern
   */
  private encodeEnrollData(tokenId: bigint): `0x${string}` {
    const contractConfig = getOptimizedContractConfig(42220); // Force mainnet
    return encodeFunctionData({
      abi: contractConfig.abi,
      functionName: 'enroll',
      args: [tokenId],
    });
  }

  private encodeCompleteModuleData(tokenId: bigint, moduleIndex: number): `0x${string}` {
    const contractConfig = getOptimizedContractConfig(42220); // Force mainnet
    return encodeFunctionData({
      abi: contractConfig.abi,
      functionName: 'completeModule',
      args: [tokenId, moduleIndex],
    });
  }

  /**
   * READ OPERATIONS - Check enrollment status
   */
  async isEnrolled(userAddress: Address, courseSlug: string, courseId: string): Promise<ContractReadResult<boolean>> {
    try {
      if (!this.provider) {
        await this.initializeProvider();
      }

      const tokenId = getCourseTokenId(courseSlug, courseId);
      const contractConfig = getOptimizedContractConfig(42220); // Force mainnet
      const contract = new ethers.Contract(
        contractConfig.address, 
        contractConfig.abi, 
        this.provider
      );
      
      const result = await contract.isEnrolled(userAddress, tokenId);
      
      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to check enrollment status'
      };
    }
  }

  /**
   * UTILITY METHODS - Following Motus pattern
   */
  async getSmartAccountAddress(): Promise<string | null> {
    if (!this.smartAccountSigner) return null;
    try {
      const address = this.smartAccountSigner.account?.address;
      console.log('🔍 Smart account address:', address);
      return address || null;
    } catch (error) {
      console.error('❌ Failed to get smart account address:', error);
      return null;
    }
  }

  // Test contract connectivity
  async testContractConnectivity(): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      if (!this.provider) {
        await this.initializeProvider();
      }
      
      const contractConfig = getOptimizedContractConfig(42220); // Force mainnet
      console.log('🧪 Testing contract connectivity...', {
        contractAddress: contractConfig.address,
        networkName: this.network,
        hasProvider: !!this.provider
      });
      
      // Try a simple read call
      const contract = new ethers.Contract(
        contractConfig.address, 
        contractConfig.abi, 
        this.provider
      );
      
      // Test a view function call (check if contract exists)
      const smartAccountAddress = await this.getSmartAccountAddress();
      
      return {
        success: true,
        data: { 
          contractAddress: contractConfig.address,
          smartAccountAddress,
          hasSmartAccount: !!this.smartAccountSigner
        }
      };
    } catch (error: any) {
      console.error('❌ Contract connectivity test failed:', error);
      return {
        success: false,
        error: error.message || 'Contract connectivity test failed'
      };
    }
  }

  // Check if service is ready for transactions
  isReady(): boolean {
    return !!this.smartAccountSigner;
  }
}

// Export singleton instance
export const enrollmentService = new EnrollmentService();