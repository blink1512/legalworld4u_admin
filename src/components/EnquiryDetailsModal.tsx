import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Enquiry } from "@/types/enquiry";
import { format } from "date-fns";
import { User, Phone, Mail, FileText, Clock } from "lucide-react";

interface EnquiryDetailsModalProps {
  enquiry: Enquiry | null;
  open: boolean;
  onClose: () => void;
}

const EnquiryDetailsModal = ({ enquiry, open, onClose }: EnquiryDetailsModalProps) => {
  if (!enquiry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Enquiry Details</span>
            <Badge variant="secondary" className="ml-2">
              {enquiry.trackingId}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{enquiry.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{enquiry.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{enquiry.email}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Case Details */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Case Details</h3>
            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Case Type</p>
                  <p className="font-medium">{enquiry.caseType}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-foreground">{enquiry.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Current Status:</p>
                <Badge>{enquiry.currentStatus}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Status Timeline</h3>
            <div className="space-y-4">
              {enquiry.timeline.map((entry, index) => (
                <div key={entry._id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    {index < enquiry.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{entry.status}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(entry.updatedAt), "dd MMM yyyy, hh:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.remark}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryDetailsModal;
