/**
 * Admin authentication utilities
 */

export function isAdmin(address: string | undefined): boolean {
  if (!address) return false;
  
  const adminWallets = (process.env.NEXT_PUBLIC_ADMIN_WALLETS || '')
    .split(',')
    .map(w => w.trim().toLowerCase());
  
  return adminWallets.includes(address.toLowerCase());
}

export function getAdminWallets(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_WALLETS || '')
    .split(',')
    .map(w => w.trim())
    .filter(Boolean);
}
