"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TopBarSearch() {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchValue);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search projects, documents, team..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full bg-background pl-10 pr-4"
      />
    </form>
  );
}
