import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { enquiryApi } from "@/lib/api";
import { Enquiry } from "@/types/enquiry";

interface UpdateStatusModalProps {
  enquiry: Enquiry | null;
  open: boolean;
  onClose: () => void;
}

const UpdateStatusModal = ({ enquiry, open, onClose }: UpdateStatusModalProps) => {
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: enquiryApi.updateEnquiryStatus,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setStatus("");
    setRemark("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry || !status.trim() || !remark.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      trackingId: enquiry.trackingId,
      status: status.trim(),
      remark: remark.trim(),
    });
  };

  if (!enquiry) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status - {enquiry.trackingId}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentStatus">Current Status</Label>
            <Input
              id="currentStatus"
              value={enquiry.currentStatus}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newStatus">New Status *</Label>
            <Input
              id="newStatus"
              placeholder="Enter new status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remark">Remark *</Label>
            <Textarea
              id="remark"
              placeholder="Enter remark or notes"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
