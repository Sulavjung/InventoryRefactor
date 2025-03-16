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
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { addAile, addShelf, Aile, Shelf } from "@/store/slices/exampleSlices";
import { useState } from "react";
import { Plus } from "lucide-react";

const wait = () => new Promise((resolve) => setTimeout(resolve, 100));

const formSchema = z.object({
  name: z.string().nonempty("Aile name cannot be empty."),
});

interface AddShelfProps {
  aileNumber: string;
  [key: string]: any;
}

export function AddShelf({ aileNumber, ...props }: AddShelfProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const dispatch = useDispatch();

  function onSubmit(data: z.infer<typeof formSchema>) {
    const shelf: Shelf = {
      id: Date.now().toString(),
      ...data,
      aile_id: aileNumber,
    };
    dispatch(addShelf(shelf));
    wait().then(() => setOpen(false));
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Plus {...props} size={24} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add new Shelf to this Aile.</AlertDialogTitle>
          <AlertDialogDescription>
            Adding a new shelf will help you organize your items better.
          </AlertDialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="add-aile-form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Shelf Name" />
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
