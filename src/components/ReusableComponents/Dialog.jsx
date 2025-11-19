import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Dialogue = ({ isOpen, handleClose, title, child }) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <form>
        <DialogContent className="max-sm:w-96 rounded-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {child}
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default Dialogue;
