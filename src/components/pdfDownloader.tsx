import { Download, Share } from "lucide-react";
import { Button } from "./ui/button";
import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  pdf,
  View,
  Image,
} from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import {
  selectSetting,
  selectToPrintItems,
} from "@/store/slices/exampleSlices";
import { useParams } from "react-router-dom";
import JsBarcode from "jsbarcode";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import { useState } from "react";
import { StandardPageSize } from "@react-pdf/types";
import { FormLabel } from "./ui/form";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type Theme = {
  id: string;
  name: string;
};

export default function PdfGenerator() {
  const [size, setSize] = useState<StandardPageSize>("A4");
  const [theme, setTheme] = useState("DEFAULT");
  const { aileId, shelveId } = useParams();
  const toPrintItems = useSelector(selectToPrintItems);
  const setting = useSelector(selectSetting);
  const shelveRelatedItems = toPrintItems.filter(
    (product) => product.shelf_id === shelveId
  );

  const handleDownload = async () => {
    const blob = await pdf(<LabelPDF />).toBlob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quixote.pdf";
    link.click();
  };

  // Function to generate a barcode image (Base64) using JsBarcode
  const generateBarcodeImage = (sku: string) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, sku, {
      format: "CODE128", // You can change this to other formats
      displayValue: false, // Hide the display value
      width: 2,
      height: 40,
    });
    return canvas.toDataURL("image/png"); // Return the image as Base64
  };

  const LabelPDF = () => {
    switch (theme) {
      case "DEFAULT":
        return (
          <Document>
            <Page style={styles.body} size={size}>
              <Text style={styles.header} fixed>
                Created on labelcreator, a product by @sulav_hamal
              </Text>
              <View style={styles.page}>
                {shelveRelatedItems.map((item) => (
                  <View style={styles.card} key={item.sku} wrap={false}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <View style={styles.cardContent}>
                      <View
                        style={[styles.barcodeWrapper, styles.contentWidth]}
                      >
                        {/* Generate and render the barcode image */}
                        <Image
                          src={generateBarcodeImage(item.sku)} // Use the generated barcode image (Base64)
                          style={styles.barcodeImage}
                        />
                      </View>
                      <View style={styles.verticalBar}></View>
                      <View style={[styles.textWrapper, styles.contentWidth]}>
                        {setting.showSize && (
                          <Text style={styles.text}>Size: {item.size}</Text>
                        )}
                        {setting.showPrice && (
                          <Text style={styles.price}>${item.price}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </Page>
          </Document>
        );
      case "YELLOW": {
        return (
          <Document>
            <Page style={styles.body} size={size}>
              <Text style={styles.header} fixed>
                Created on labelcreator, a product by @sulav_hamal
              </Text>
              <View style={styles.page}>
                {shelveRelatedItems.map((item) => (
                  <View style={styles.card} key={item.sku} wrap={false}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <View style={styles.cardContent}>
                      <View
                        style={[styles.barcodeWrapper, styles.contentWidth]}
                      >
                        {/* Generate and render the barcode image */}
                        <Image
                          src={generateBarcodeImage(item.sku)} // Use the generated barcode image (Base64)
                          style={styles.barcodeImage}
                        />
                      </View>
                      <View style={styles.verticalBar}></View>
                      <View style={[styles.textWrapper, styles.contentWidth]}>
                        {setting.showSize && (
                          <Text style={styles.text}>Size: {item.size}</Text>
                        )}
                        {setting.showPrice && (
                          <Text style={[styles.price, styles.yellow]}>
                            ${item.price}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </Page>
          </Document>
        );
      }
      default:
        return <Document />;
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Share size={18} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review the .pdf file.</DialogTitle>
            <DialogDescription>
              The file below is what you will have once downloaded. Make sure
              it's correct.
            </DialogDescription>
          </DialogHeader>

          {/* Selector to select the document size. */}
          <div>
            <Label>Document Size</Label>
            <Select
              onValueChange={(value) => setSize(value as StandardPageSize)}
              defaultValue="LETTER"
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a Document Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Document Size</SelectLabel>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Theme</Label>
            <Tabs
              defaultValue="DEFAULT"
              className="w-100%"
              onValueChange={(value) => setTheme(value)}
            >
              <TabsList className="grid w-full grid-cols-2">
                {allThemes.map((theme) => (
                  <TabsTrigger value={theme.id}>{theme.name}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <PDFViewer
            width={"100%"}
            height={"300px"}
            className="border rounded-md drop-shadow-lg"
          >
            <LabelPDF />
          </PDFViewer>
          <Button onClick={handleDownload}>
            <span className="pe-4">Download</span> <Download size={15} />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Ensures that the columns are spaced evenly
  },
  body: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: "10px",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Oswald",
    border: "1px solid black",
    borderRadius: 9,
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Oswald",
  },

  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  card: {
    border: "1px solid black",
    marginBottom: 10,
    borderRadius: 5,
    width: "48%",
  },
  cardTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    borderBottom: "1px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: "10",
    justifyContent: "space-between",
    width: "100%",
  },
  contentWidth: {
    width: "30%",
    paddingVertical: 2,
  },
  barcodeWrapper: {
    textAlign: "center",
  },
  verticalBar: {
    width: "1px",
    backgroundColor: "black",
  },
  textWrapper: {
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    textAlign: "center",
  },
  price: {
    fontSize: 22,
    fontWeight: "extrabold",
    color: "black",
    textAlign: "right",
  },
  yellow: {
    backgroundColor: "yellow",
  },
  barcodeImage: {},
});

// Page sizes for 72dpi. 72dpi is used internally by pdfkit.
const PAGE_SIZES = [
  "4A0",
  "2A0",
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "A10",
  "B0",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "C0",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "C10",
  "RA0",
  "RA1",
  "RA2",
  "RA3",
  "RA4",
  "SRA0",
  "SRA1",
  "SRA2",
  "SRA3",
  "SRA4",
  "EXECUTIVE",
  "FOLIO",
  "LEGAL",
  "LETTER",
  "TABLOID",
  "ID1",
];

const allThemes: Theme[] = [
  { id: "DEFAULT", name: "Default" },
  { id: "YELLOW", name: "Price Popper" },
];
