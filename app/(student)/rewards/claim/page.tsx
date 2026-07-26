import { PageHeader } from "@/components/layout/page-header";
import { QrCodeCard } from "@/components/shared/qr-code-card";

export default function RewardClaimPage() {
  return <div className="mx-auto grid w-full max-w-xl gap-6"><PageHeader description="Present this code to the authorised campus redemption desk." eyebrow="Reward claim" title="Campus café voucher" /><QrCodeCard title="QR reward claim" description="Valid only as a UI demonstration." reference="RWD-CAFE-7824" value="voxa:reward:cafe-voucher:RWD-CAFE-7824" /></div>;
}
