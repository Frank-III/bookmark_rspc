import { NewLinkForm } from "../forms/new_link_forms"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export function NewLink() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">NewLink</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <NewLinkForm />
      </DialogContent>
    </Dialog>
  )
}
