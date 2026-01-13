function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Casa LLA</h2>
      </div>
      <div className="flex items-center gap-4">
        {/* Add user menu, notifications, etc. here */}
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm text-muted-foreground">U</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
