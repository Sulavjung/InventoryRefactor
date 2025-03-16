"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import {
  ExampleState,
  selectState,
  updateProduct,
  updateSetting,
} from "@/store/slices/exampleSlices";
import { Label } from "./ui/label";

const formSchema = z.object({
  data: z.array(z.instanceof(File)),
  identifierIs: z.string().default("Barcode"),
  showName: z.boolean().default(true), // Default value set to true
  showSize: z.boolean().default(true), // Default value set to true
  showPrice: z.boolean().default(true), // Default value set to true
  showIdentifier: z.boolean().default(true), // Default value set to true
  whichCName: z.string(),
  whichCQR: z.string(),
  whichCSize: z.string(),
  whichCPrice: z.string(),
});

export default function MyForm() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const dispatch = useDispatch();

  const state: ExampleState = useSelector(selectState);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (files && Array.isArray(files)) {
      const file = files[0]; // Assuming the data is an array of files
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const parsedData = JSON.parse(reader.result as string);

          dispatch(updateProduct(parsedData));

          // Assuming the JSON is an array of objects and columns are keys of the first object
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            const firstRow = parsedData[0];
            const columnNames = Object.keys(firstRow); // Extract column names
            setColumns(columnNames); // Update the state with column names
          } else {
            console.error("Invalid data format: Not an array or empty array");
            toast.error("The file must contain an array of objects.");
          }
        } catch (err) {
          console.error("Error parsing the JSON file:", err);
          toast.error("Invalid JSON format in the file.");
        }
      };

      reader.onerror = (err) => {
        console.error("Error reading the file:", err);
        toast.error("Failed to read the file. Please try again.");
      };

      reader.readAsText(file);
    }
  }, [files]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //Extract setting only.
      const { data, ...setting } = values;

      //Add is Submitted to true as well.
      const fullData = { ...setting, isSubmitted: true };

      dispatch(updateSetting(fullData));
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select File</FormLabel>
              <FormControl>
                <Controller
                  name="data"
                  control={form.control}
                  render={({ field }) => (
                    <FileUploader
                      value={files}
                      onValueChange={(file) => {
                        setFiles(file);
                        field.onChange(file); // Update react-hook-form value
                      }}
                      dropzoneOptions={dropZoneConfig}
                      className="relative bg-background rounded-lg p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                          <CloudUpload className="text-gray-500 w-10 h-10" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                          JSON
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  )}
                />
              </FormControl>
              {state.isSubmitted === true ? (
                <FormDescription>
                  There is data stored from your last upload. Only if you want
                  to update the inventory, upload .json file again.
                </FormDescription>
              ) : (
                <FormDescription>Select a file to upload.</FormDescription>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identifierIs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style of the Unique Identifier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select one. " />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="QR">QR</SelectItem>
                  <SelectItem value="Barcode">Barcode</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This allows either barcode or QR Code to be shown on each label.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="showName"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Should show name?</FormLabel>
                    <FormDescription>
                      If enabled, items name will be shown on labels.{" "}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      defaultChecked={true}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="showSize"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Should show size?</FormLabel>
                    <FormDescription>
                      If enabled, size will be shown in each label.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      defaultChecked={true}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="showPrice"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Should show price?</FormLabel>
                    <FormDescription>
                      If enabled, price will be shown on each label.{" "}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      defaultChecked={true}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="showIdentifier"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Should show QR?</FormLabel>
                    <FormDescription>
                      Barcode or QR will be shown if enabled.{" "}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      defaultChecked={true}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="whichCName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which column is Name?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column + "1"} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whichCQR"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which column is QR code?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column + "2"} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whichCSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which column is Size?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column + "3"} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whichCPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which column is Price?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column + "4"} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the column which has price from the data that you
                provided.{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
