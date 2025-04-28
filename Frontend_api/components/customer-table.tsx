"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CustomerData } from "@/lib/types"
import { ChevronDown, Filter, Search, ArrowUpDown, Download } from "lucide-react"

interface CustomerTableProps {
  customers: CustomerData[]
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCluster, setFilterCluster] = useState<number | null>(null)
  const [sortField, setSortField] = useState<keyof CustomerData>("customerId")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Handle sorting
  const handleSort = (field: keyof CustomerData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customerId.toString().includes(searchTerm) ||
      (customer.gender && customer.gender.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.age && customer.age.toString().includes(searchTerm)) ||
      customer.annualIncome.toString().includes(searchTerm) ||
      customer.spendingScore.toString().includes(searchTerm)

    const matchesCluster = filterCluster === null || customer.cluster === filterCluster

    return matchesSearch && matchesCluster
  })

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginate customers
  const totalPages = Math.ceil(sortedCustomers.length / rowsPerPage)
  const paginatedCustomers = sortedCustomers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const uniqueClusters = Array.from(new Set(customers.map((c) => c.cluster))).sort((a, b) => a - b)

  // Export to CSV
  const exportToCsv = () => {
    const headers = ["Customer ID", "Gender", "Age", "Annual Income", "Spending Score", "Cluster"]

    const csvRows = [
      headers.join(","),
      ...filteredCustomers.map((customer) =>
        [
          customer.customerId,
          customer.gender || "",
          customer.age || "",
          customer.annualIncome,
          customer.spendingScore,
          customer.cluster + 1,
        ].join(","),
      ),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n")
    const encodedUri = encodeURI(csvContent)

    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "customer_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Cluster</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterCluster(null)}>All Clusters</DropdownMenuItem>
              {uniqueClusters.map((cluster) => (
                <DropdownMenuItem key={cluster} onClick={() => setFilterCluster(cluster)}>
                  Cluster {cluster + 1}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={exportToCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] cursor-pointer" onClick={() => handleSort("customerId")}>
                <div className="flex items-center">
                  ID
                  {sortField === "customerId" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              {customers.some((c) => c.gender) && <TableHead>Gender</TableHead>}
              {customers.some((c) => c.age) && (
                <TableHead className="cursor-pointer" onClick={() => handleSort("age")}>
                  <div className="flex items-center">
                    Age
                    {sortField === "age" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
              )}
              <TableHead className="cursor-pointer" onClick={() => handleSort("annualIncome")}>
                <div className="flex items-center">
                  Annual Income (k$)
                  {sortField === "annualIncome" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("spendingScore")}>
                <div className="flex items-center">
                  Spending Score (1-100)
                  {sortField === "spendingScore" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("cluster")}>
                <div className="flex items-center">
                  Cluster
                  {sortField === "cluster" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell>{customer.customerId}</TableCell>
                  {customers.some((c) => c.gender) && <TableCell>{customer.gender}</TableCell>}
                  {customers.some((c) => c.age) && <TableCell>{customer.age}</TableCell>}
                  <TableCell>{customer.annualIncome}</TableCell>
                  <TableCell>{customer.spendingScore}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${customer.cluster === 0 ? "bg-rose-100 text-rose-800" : ""}
                      ${customer.cluster === 1 ? "bg-blue-100 text-blue-800" : ""}
                      ${customer.cluster === 2 ? "bg-amber-100 text-amber-800" : ""}
                      ${customer.cluster === 3 ? "bg-emerald-100 text-emerald-800" : ""}
                      ${customer.cluster === 4 ? "bg-violet-100 text-violet-800" : ""}
                      ${customer.cluster === 5 ? "bg-pink-100 text-pink-800" : ""}
                      ${customer.cluster === 6 ? "bg-cyan-100 text-cyan-800" : ""}
                      ${customer.cluster === 7 ? "bg-lime-100 text-lime-800" : ""}
                      ${customer.cluster === 8 ? "bg-indigo-100 text-indigo-800" : ""}
                      ${customer.cluster === 9 ? "bg-teal-100 text-teal-800" : ""}
                    `}
                    >
                      Cluster {customer.cluster + 1}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={customers.some((c) => c.gender) ? 6 : 5} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 mx-1"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
