"use client";

import React, { useState } from "react";
import { Star, Search, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Stock type definition
interface Stock {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  percentChange: number;
  logo: string; // URL to logo image or placeholder
  sector: string;
  marketCap: number; // in billions KES
  volume: number; // trading volume
  peRatio: number; // Price to Earnings ratio
  week52High: number;
  week52Low: number;
  dividendYield: number; // percentage
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  eps: number; // Earnings per share
}

// NSE Stock data - Updated with comprehensive information
const nseStocks: Stock[] = [
  {
    name: "Safaricom PLC",
    symbol: "SCOM",
    price: 28.50,
    change24h: 0.75,
    percentChange: 2.70,
    logo: "/logos/safaricom.png", // Placeholder - replace with actual logo path
    sector: "Telecommunications",
    marketCap: 1140.5, // KES billions
    volume: 15420000,
    peRatio: 12.5,
    week52High: 32.50,
    week52Low: 22.00,
    dividendYield: 5.26,
    open: 27.75,
    previousClose: 27.75,
    dayHigh: 28.75,
    dayLow: 27.50,
    eps: 2.28,
  },
  {
    name: "Equity Group Holdings",
    symbol: "EQTY",
    price: 52.00,
    change24h: 1.25,
    percentChange: 2.46,
    logo: "/logos/equity.png",
    sector: "Banking",
    marketCap: 197.6,
    volume: 3250000,
    peRatio: 4.8,
    week52High: 58.00,
    week52Low: 42.50,
    dividendYield: 7.69,
    open: 50.75,
    previousClose: 50.75,
    dayHigh: 52.50,
    dayLow: 50.50,
    eps: 10.83,
  },
  {
    name: "KCB Group PLC",
    symbol: "KCB",
    price: 38.75,
    change24h: 0.35,
    percentChange: 0.91,
    logo: "/logos/kcb.png",
    sector: "Banking",
    marketCap: 154.2,
    volume: 2180000,
    peRatio: 3.2,
    week52High: 45.00,
    week52Low: 32.00,
    dividendYield: 10.32,
    open: 38.40,
    previousClose: 38.40,
    dayHigh: 39.00,
    dayLow: 38.00,
    eps: 12.11,
  },
  {
    name: "East African Breweries",
    symbol: "EABL",
    price: 165.00,
    change24h: 2.50,
    percentChange: 1.54,
    logo: "/logos/eabl.png",
    sector: "Manufacturing",
    marketCap: 127.8,
    volume: 425000,
    peRatio: 11.2,
    week52High: 180.00,
    week52Low: 145.00,
    dividendYield: 6.06,
    open: 162.50,
    previousClose: 162.50,
    dayHigh: 166.00,
    dayLow: 162.00,
    eps: 14.73,
  },
  {
    name: "Co-operative Bank",
    symbol: "COOP",
    price: 14.80,
    change24h: 0.15,
    percentChange: 1.02,
    logo: "/logos/coop.png",
    sector: "Banking",
    marketCap: 99.4,
    volume: 5670000,
    peRatio: 5.4,
    week52High: 17.50,
    week52Low: 12.00,
    dividendYield: 8.11,
    open: 14.65,
    previousClose: 14.65,
    dayHigh: 14.95,
    dayLow: 14.60,
    eps: 2.74,
  },
  {
    name: "Bamburi Cement",
    symbol: "BAMB",
    price: 25.50,
    change24h: -0.25,
    percentChange: -0.97,
    logo: "/logos/bamburi.png",
    sector: "Manufacturing",
    marketCap: 48.2,
    volume: 180000,
    peRatio: 8.9,
    week52High: 32.00,
    week52Low: 22.00,
    dividendYield: 3.92,
    open: 25.75,
    previousClose: 25.75,
    dayHigh: 26.00,
    dayLow: 25.25,
    eps: 2.87,
  },
  {
    name: "British American Tobacco",
    symbol: "BAT",
    price: 280.00,
    change24h: -1.50,
    percentChange: -0.53,
    logo: "/logos/bat.png",
    sector: "Manufacturing",
    marketCap: 140.5,
    volume: 95000,
    peRatio: 7.8,
    week52High: 320.00,
    week52Low: 250.00,
    dividendYield: 10.71,
    open: 281.50,
    previousClose: 281.50,
    dayHigh: 282.00,
    dayLow: 278.50,
    eps: 35.90,
  },
  {
    name: "Stanbic Holdings",
    symbol: "SBK",
    price: 108.50,
    change24h: 0.95,
    percentChange: 0.88,
    logo: "/logos/stanbic.png",
    sector: "Banking",
    marketCap: 67.8,
    volume: 420000,
    peRatio: 6.1,
    week52High: 125.00,
    week52Low: 95.00,
    dividendYield: 9.22,
    open: 107.55,
    previousClose: 107.55,
    dayHigh: 109.00,
    dayLow: 107.00,
    eps: 17.79,
  },
  {
    name: "Nation Media Group",
    symbol: "NMG",
    price: 16.20,
    change24h: 0.40,
    percentChange: 2.53,
    logo: "/logos/nmg.png",
    sector: "Media",
    marketCap: 11.8,
    volume: 1250000,
    peRatio: 15.8,
    week52High: 22.00,
    week52Low: 12.50,
    dividendYield: 4.94,
    open: 15.80,
    previousClose: 15.80,
    dayHigh: 16.40,
    dayLow: 15.75,
    eps: 1.03,
  },
  {
    name: "NCBA Group",
    symbol: "NCBA",
    price: 42.00,
    change24h: -0.35,
    percentChange: -0.83,
    logo: "/logos/ncba.png",
    sector: "Banking",
    marketCap: 45.3,
    volume: 890000,
    peRatio: 4.2,
    week52High: 48.00,
    week52Low: 35.00,
    dividendYield: 9.52,
    open: 42.35,
    previousClose: 42.35,
    dayHigh: 42.50,
    dayLow: 41.75,
    eps: 10.00,
  },
  {
    name: "Kenya Airways",
    symbol: "KQ",
    price: 3.85,
    change24h: 0.12,
    percentChange: 3.22,
    logo: "/logos/kq.png",
    sector: "Aviation",
    marketCap: 1.9,
    volume: 8950000,
    peRatio: -2.5, // Negative due to losses
    week52High: 5.50,
    week52Low: 2.80,
    dividendYield: 0.00,
    open: 3.73,
    previousClose: 3.73,
    dayHigh: 3.90,
    dayLow: 3.70,
    eps: -1.54,
  },
  {
    name: "Safaricom Investment Coop",
    symbol: "SICO",
    price: 12.50,
    change24h: 0.25,
    percentChange: 2.04,
    logo: "/logos/sico.png",
    sector: "Investment",
    marketCap: 8.5,
    volume: 450000,
    peRatio: 8.5,
    week52High: 15.00,
    week52Low: 10.00,
    dividendYield: 6.40,
    open: 12.25,
    previousClose: 12.25,
    dayHigh: 12.60,
    dayLow: 12.20,
    eps: 1.47,
  },
  {
    name: "Standard Chartered Bank",
    symbol: "SCBK",
    price: 158.00,
    change24h: 2.00,
    percentChange: 1.28,
    logo: "/logos/scbk.png",
    sector: "Banking",
    marketCap: 59.6,
    volume: 145000,
    peRatio: 5.8,
    week52High: 175.00,
    week52Low: 135.00,
    dividendYield: 11.39,
    open: 156.00,
    previousClose: 156.00,
    dayHigh: 159.00,
    dayLow: 155.50,
    eps: 27.24,
  },
  {
    name: "Kenya Power & Lighting",
    symbol: "KPLC",
    price: 2.10,
    change24h: -0.05,
    percentChange: -2.33,
    logo: "/logos/kplc.png",
    sector: "Energy",
    marketCap: 4.2,
    volume: 12500000,
    peRatio: -1.8,
    week52High: 3.50,
    week52Low: 1.50,
    dividendYield: 0.00,
    open: 2.15,
    previousClose: 2.15,
    dayHigh: 2.18,
    dayLow: 2.05,
    eps: -1.17,
  },
  {
    name: "Britam Holdings",
    symbol: "BRIT",
    price: 6.45,
    change24h: 0.18,
    percentChange: 2.87,
    logo: "/logos/britam.png",
    sector: "Insurance",
    marketCap: 12.8,
    volume: 2100000,
    peRatio: 9.2,
    week52High: 8.50,
    week52Low: 5.00,
    dividendYield: 4.65,
    open: 6.27,
    previousClose: 6.27,
    dayHigh: 6.50,
    dayLow: 6.25,
    eps: 0.70,
  },
];

const filterTabs = [
  "All",
  "Watchlist",
  "Top movers",
  "Top traded",
  "Recently launched",
  "Banking",
  "Telecom",
  "Manufacturing",
];

const TradePage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTradeTab, setActiveTradeTab] = useState("Buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const filteredStocks = nseStocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format number helper
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K";
    }
    return num.toString();
  };

  // Define table columns
  const columns: ColumnDef<Stock>[] = [
    {
      accessorKey: "name",
      header: "Asset",
      cell: ({ row }) => {
        const stock = row.original;
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center overflow-hidden border border-border">
              {/* Will display logo when available, fallback to first letter */}
              <div className="text-lg font-bold text-foreground">
                {stock.symbol.charAt(0)}
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground">
                {stock.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {stock.symbol} • {stock.sector}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        const price = row.original.price;
        return (
          <div className="text-right font-mono font-semibold min-w-[100px]">
            KES {price.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "change24h",
      header: () => <div className="text-right">Change</div>,
      cell: ({ row }) => {
        const change = row.original.change24h;
        const percent = row.original.percentChange;
        return (
          <div className="text-right min-w-[100px]">
            <div
              className={`font-mono font-semibold ${
                change >= 0 ? "trading-green" : "trading-red"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {percent.toFixed(2)}%
            </div>
            <div
              className={`text-xs font-mono ${
                change >= 0 ? "trading-green" : "trading-red"
              }`}
            >
              {change >= 0 ? "+" : ""}
              KES {change.toFixed(2)}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "marketCap",
      header: () => <div className="text-right">Market Cap</div>,
      cell: ({ row }) => {
        const marketCap = row.original.marketCap;
        return (
          <div className="text-right font-mono min-w-[100px]">
            <div className="font-semibold">
              KES {marketCap.toFixed(1)}B
            </div>
            <div className="text-xs text-muted-foreground">
              Billions
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "volume",
      header: () => <div className="text-right">Volume</div>,
      cell: ({ row }) => {
        const volume = row.original.volume;
        return (
          <div className="text-right font-mono min-w-[90px]">
            {formatNumber(volume)}
          </div>
        );
      },
    },
    {
      accessorKey: "peRatio",
      header: () => <div className="text-right">P/E Ratio</div>,
      cell: ({ row }) => {
        const pe = row.original.peRatio;
        return (
          <div
            className={`text-right font-mono min-w-[80px] ${
              pe < 0 ? "text-muted-foreground" : ""
            }`}
          >
            {pe < 0 ? "N/A" : pe.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "dividendYield",
      header: () => <div className="text-right">Div Yield</div>,
      cell: ({ row }) => {
        const divYield = row.original.dividendYield;
        return (
          <div
            className={`text-right font-mono min-w-[80px] ${
              divYield > 0 ? "trading-green" : "text-muted-foreground"
            }`}
          >
            {divYield > 0 ? `${divYield.toFixed(2)}%` : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "week52High",
      header: () => <div className="text-right">52W High</div>,
      cell: ({ row }) => {
        const high = row.original.week52High;
        return (
          <div className="text-right font-mono text-xs min-w-[80px]">
            KES {high.toFixed(2)}
          </div>
        );
      },
    },
    {
      id: "watchlist",
      header: "",
      cell: ({ row }) => {
        const stock = row.original;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(stock.symbol);
            }}
            className="p-2 hover:bg-surface rounded transition-colors"
          >
            <Star
              className={`w-5 h-5 ${
                watchlist.includes(stock.symbol)
                  ? "fill-warning text-warning"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredStocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="h-full flex gap-6">
      {/* Left Section - Stock List */}
      <div className="flex-1 trading-card border border-border overflow-hidden flex flex-col">
        {/* Header with Search */}
        <div className="p-6 border-b border-border">
          <h1 className="text-3xl font-bold mb-6 font-audiowide">Trade</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for assets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4 border-b border-border overflow-x-auto scrollbar-thin">
          <div className="flex gap-2 min-w-max">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === tab
                    ? "bg-foreground text-background"
                    : "bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {tab === "Watchlist" && <Star className="inline w-3 h-3 mr-1" />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Table */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-surface/95 backdrop-blur z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-medium text-muted-foreground h-12 px-6"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border hover:bg-surface-hover transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No stocks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Right Section - Trading Panel */}
      <div className="w-96 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
        {/* Make a Trade Card */}
        <div className="trading-card border border-border p-6">
          <h2 className="text-xl font-bold mb-6">Make a trade</h2>

          {/* Buy/Sell/Convert Tabs */}
          <div className="flex gap-2 mb-6">
            {["Buy", "Sell", "Convert"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTradeTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTradeTab === tab
                    ? "bg-surface-elevated text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Frequency */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Frequency</label>
            <div className="relative">
              <select className="w-full h-10 rounded-lg bg-surface-elevated border border-border px-3 text-sm appearance-none cursor-pointer hover:bg-surface-hover transition-colors">
                <option>Once</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                KES
              </span>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-14 pr-14 text-right font-mono text-lg h-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                KES
              </span>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[500, 1000, 5000, 10000].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(value.toString())}
                  className="py-2 px-3 rounded-lg bg-surface-elevated hover:bg-surface-hover transition-colors text-sm font-medium"
                >
                  {value >= 1000 ? `${value / 1000}k` : value}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Select Stock</label>
            <div className="relative">
              <select className="w-full h-12 rounded-lg bg-surface-elevated border border-border px-3 text-sm appearance-none cursor-pointer hover:bg-surface-hover transition-colors">
                <option value="">Choose a stock to trade</option>
                {nseStocks.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Balance Info */}
          <div className="mb-6 p-3 rounded-lg bg-surface-elevated border border-border hover:bg-surface-hover transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                  💰
                </div>
                <div>
                  <div className="text-sm font-semibold">KES balance</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    KES 10,000.00
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 trading-button-primary h-11 font-semibold"
              disabled={!amount}
            >
              Instant
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-11 font-semibold"
              disabled={!amount}
            >
              Review order
            </Button>
          </div>
        </div>

        {/* Market Info Card */}
        <div className="trading-card border border-border p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Market Info
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Market Status</span>
              <Badge variant="default" className="bg-success">
                Open
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trading Hours</span>
              <span className="font-mono">9:00 - 15:00 EAT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Settlement</span>
              <span className="font-mono">T+3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePage;
