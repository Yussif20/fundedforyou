import { SinglePropFirm } from "@/types/firm.types";
import FirmHeader from "./FirmHeader";

export default function FirmDetails({ data }: { data: SinglePropFirm }) {
  return (
    <div className="space-y-10 relative ">
      <FirmHeader company={data} />
      {/* <TopOffer company={data} /> */}
    </div>
  );
}
