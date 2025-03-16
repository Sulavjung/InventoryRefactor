import Labels from "@/components/label";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import PdfGenerator from "@/components/pdfDownloader";
import SkuInput from "@/components/SkuInput";
import { selectAiles, selectShelves } from "@/store/slices/exampleSlices";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AisleShelfDetails = () => {
  const { aisleId, shelveId } = useParams();
  const navigate = useNavigate();
  const ailes = useSelector(selectAiles);
  const shelves = useSelector(selectShelves);

  useEffect(() => {
    // Check if the aisle or shelf exists
    const aisleExists = ailes.some((aisle) => aisle.id === aisleId);
    const shelfExists = shelves.some((shelf) => shelf.id === shelveId);

    if (!aisleExists || !shelfExists) {
      toast.error("Aile or Shelf doesn't exist.");
      navigate("/"); // Redirect to home if aisle or shelf doesn't exist
    }
  }, [aisleId, shelveId, ailes, shelves, navigate]);

  // Find the aisle and shelf details for display
  const aisle = ailes.find((aisle) => aisle.id === aisleId);
  const shelf = shelves.find((shelf) => shelf.id === shelveId);

  return (
    <div >
      <PageHeader>
        <PageHeaderHeading>{shelf?.name}</PageHeaderHeading>
        <PdfGenerator />
      </PageHeader>
      <PageHeaderDescription>
        Here you will be able to see all the products related to this shelf.
      </PageHeaderDescription>
      <SkuInput />
      <Labels />
    </div>
  );
};

export default AisleShelfDetails;
