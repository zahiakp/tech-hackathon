"use client";

import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QrCodeCardProps = {
  title: string;
  description: string;
  value: string;
  reference: string;
};

export function QrCodeCard({
  title,
  description,
  value,
  reference,
}: QrCodeCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="items-center text-center">
        <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
          <QrCode className="size-5" aria-hidden="true" />
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid justify-items-center gap-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <QRCodeSVG
            bgColor="#ffffff"
            fgColor="#111827"
            level="M"
            marginSize={1}
            size={208}
            title={title}
            value={value}
          />
        </div>
        <p className="font-mono text-sm font-medium tracking-wide">{reference}</p>
      </CardContent>
    </Card>
  );
}
