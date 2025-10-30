export default function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm sm:text-base">
      <span className="mb-1 sm:mb-2 block opacity-80">{label}</span>
      {children}
    </label>
  );
}



