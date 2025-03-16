import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { addAile, Aile } from "@/store/slices/exampleSlices";
import { useState } from "react";

const wait = () => new Promise((resolve) => setTimeout(resolve, 100));

const formSchema = z.object({
  name: z.string().nonempty("Aile name cannot be empty."),
});

export function AddAiles({ ...props }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const dispatch = useDispatch();

  function onSubmit(data: z.infer<typeof formSchema>) {
    const aile: Aile = { id: Date.now().toString(), ...data };
    dispatch(addAile(aile));
    wait().then(() => setOpen(false));
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen} {...props}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add Ailes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add new Aile to your store</AlertDialogTitle>
          <AlertDialogDescription>
            Adding an aile will help you organize your store. On an Aile, you
            can further add shelves to organize your products.
          </AlertDialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="add-aile-form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Aile Name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <AlertDialogFooter className="pt-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">Submit</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
