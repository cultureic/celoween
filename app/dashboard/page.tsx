'use client';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to admin dashboard
  redirect('/admin');
}



