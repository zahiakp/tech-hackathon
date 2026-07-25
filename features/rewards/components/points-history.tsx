import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PointTransaction } from "@/features/rewards/types";
import { cn } from "@/lib/utils";

export function PointsHistory({ transactions }: { transactions: PointTransaction[] }) {
  return (
    <>
      <div className="grid gap-3 md:hidden">
        {transactions.map((transaction) => (
          <Card key={transaction.id}><CardContent className="flex items-center justify-between gap-4 p-4"><div className="min-w-0"><p className="font-medium">{transaction.title}</p><p className="text-sm text-muted-foreground">{transaction.date} · {transaction.description}</p></div><p className={cn("shrink-0 font-semibold", transaction.points > 0 ? "text-emerald-600" : "text-foreground")}>{transaction.points > 0 ? "+" : ""}{transaction.points}</p></CardContent></Card>
        ))}
      </div>
      <Card className="hidden md:block">
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Numix</TableHead></TableRow></TableHeader>
            <TableBody>{transactions.map((transaction) => <TableRow key={transaction.id}><TableCell><p className="font-medium">{transaction.title}</p><p className="text-xs text-muted-foreground">{transaction.description}</p></TableCell><TableCell>{transaction.date}</TableCell><TableCell><StatusBadge icon={transaction.type === "earned" ? ArrowDownLeft : ArrowUpRight} label={transaction.type} tone={transaction.type === "earned" ? "success" : "info"} /></TableCell><TableCell className={cn("text-right font-semibold", transaction.points > 0 && "text-emerald-600")}>{transaction.points > 0 ? "+" : ""}{transaction.points}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
