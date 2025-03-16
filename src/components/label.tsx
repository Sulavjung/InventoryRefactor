import { selectSetting, selectToPrintItems } from "@/store/slices/exampleSlices";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "./ui/card";
import Barcode from "react-barcode";

export default function Labels () {
    const {aileId, shelveId} = useParams();
    const toPrintItems = useSelector(selectToPrintItems);
    const setting = useSelector(selectSetting);
    
    const shelveRelatedItems = toPrintItems.filter((product) => (product.shelf_id === shelveId));

    return (
        <>
        <div /* key={index} */ className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-8">
          {shelveRelatedItems.map((item) => (
            <Card key={item.sku} className="mx-2 my-4 border border-black">
              <CardHeader className="border-b border-black p-3">
                <CardTitle className="text-2xl">
                  {item.name}
                </CardTitle>
              </CardHeader>
              <div className="grid grid-cols-3 text-center divide-x divide-black">
                <div className="barcode">
                  
                    <Barcode
                      value={item.sku} // Use the SKU or any other identifier for barcode generation
                      width={2} // Width of the barcode lines
                      height={30} // Height of the barcode
                      displayValue={true} // Display the SKU below the barcode
                    />
                  
                </div>
                <div style={{ alignSelf: "center" }}>
                  {setting.showSize && (
                    <span>Size: {item.size}</span>
                  )}
                </div>
                <div style={{ alignSelf: "center" }}>
                  {setting.showPrice && (
                    <span className="text-2xl font-bold text-black">
                      ${item.price}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        </>
    );
}