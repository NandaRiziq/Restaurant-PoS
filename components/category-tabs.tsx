"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CategoryTabsProps {
  activeCategory: "semua" | "makanan" | "minuman"
  onCategoryChange: (category: "semua" | "makanan" | "minuman") => void
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <Tabs value={activeCategory} onValueChange={(value) => onCategoryChange(value as any)}>
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="semua">Semua</TabsTrigger>
        <TabsTrigger value="makanan">Makanan</TabsTrigger>
        <TabsTrigger value="minuman">Minuman</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
