import QRCode from "react-qr-code"; // Install react-qr-code if you haven't already

interface ScheduleQRCodeProps {
  scheduleId: number;
}

const ScheduleQRCode = ({ scheduleId }: ScheduleQRCodeProps) => {
  const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/attendance/${scheduleId}`; // Create unique QR code URL

  return (
    <div>
      <QRCode value={qrUrl} size={128} />
    </div>
  );
};

export default ScheduleQRCode;
