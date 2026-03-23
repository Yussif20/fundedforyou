export default function SectionDivider() {
  return (
    <div className="relative w-full flex items-center justify-center my-2">
      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="relative w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_2px_rgba(5,150,102,0.3)]" />
    </div>
  );
}
