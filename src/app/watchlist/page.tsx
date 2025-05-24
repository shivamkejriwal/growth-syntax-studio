import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Trash2, Edit3, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";

const sampleWatchlist = [
  { id: "1", ticker: "AAPL", name: "Apple Inc.", price: "$170.34", change: "+1.25%", changeType: "positive", marketCap: "$2.75T", dataAiHint: "apple logo" },
  { id: "2", ticker: "MSFT", name: "Microsoft Corp.", price: "$420.55", change: "-0.50%", changeType: "negative", marketCap: "$3.12T", dataAiHint: "microsoft logo" },
  { id: "3", ticker: "GOOGL", name: "Alphabet Inc.", price: "$155.60", change: "+0.80%", changeType: "positive", marketCap: "$1.95T", dataAiHint: "google logo" },
  { id: "4", ticker: "AMZN", name: "Amazon.com Inc.", price: "$180.10", change: "+2.10%", changeType: "positive", marketCap: "$1.88T", dataAiHint: "amazon logo" },
];

export default function WatchlistPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
          <div className="flex w-full md:w-auto items-center space-x-2">
             <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Add Ticker (e.g., TSLA)" className="pl-8 md:w-[250px]" />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add to Watchlist
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Tracked Companies</CardTitle>
            <CardDescription>Monitor the performance of companies you are interested in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Logo</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleWatchlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                       <Image src={`https://placehold.co/40x40.png`} alt={`${item.ticker} logo`} width={40} height={40} data-ai-hint={item.dataAiHint}/>
                    </TableCell>
                    <TableCell className="font-medium">{item.ticker}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className={item.changeType === "positive" ? "text-primary" : "text-destructive"}>
                      <div className="flex items-center">
                        {item.changeType === "positive" ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {item.change}
                      </div>
                    </TableCell>
                    <TableCell>{item.marketCap}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Edit3 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sampleWatchlist.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <p>Your watchlist is empty. Add companies to start tracking.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
