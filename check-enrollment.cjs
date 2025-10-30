const { createPublicClient, http } = require('viem');
const { celoAlfajores } = require('viem/chains');

// Your addresses
const OPTIMIZED_CONTRACT = '0x525D78C03f3AA67951EA1b3fa1aD93DefF134ed0';
const USER_ADDRESS = '0x9f42Caf52783EF12d8174d33c281a850b8eA58aD'; // Replace with your actual address
const COURSE_ID = '93923'; // The course ID from your transaction

const client = createPublicClient({
  chain: celoAlfajores,
  transport: http('https://alfajores-forno.celo-testnet.org')
});

const ABI = [
  {
    type: 'function',
    name: 'isEnrolled',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'courseId', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  }
];

async function checkEnrollment() {
  console.log('🔍 Checking enrollment status...');
  console.log('Contract:', OPTIMIZED_CONTRACT);
  console.log('User:', USER_ADDRESS);
  console.log('Course ID:', COURSE_ID);
  console.log('');

  try {
    const result = await client.readContract({
      address: OPTIMIZED_CONTRACT,
      abi: ABI,
      functionName: 'isEnrolled',
      args: [USER_ADDRESS, BigInt(COURSE_ID)]
    });

    console.log('✅ Enrollment Status:', result ? 'ENROLLED' : 'NOT ENROLLED');
    
    if (!result) {
      console.log('❌ The user is NOT enrolled in the optimized contract');
      console.log('This explains why the UI keeps asking for enrollment');
    } else {
      console.log('✅ User IS enrolled - UI should show course content');
    }

  } catch (error) {
    console.error('❌ Error checking enrollment:', error.message);
  }
}

checkEnrollment();