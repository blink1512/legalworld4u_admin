import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { enquiryApi } from "@/lib/api";
import { Enquiry } from "@/types/enquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import EnquiryDetailsModal from "@/components/EnquiryDetailsModal";
import UpdateStatusModal from "@/components/UpdateStatusModal";
import { format } from "date-fns";
import { Search, Eye, Edit, ArrowLeft, LogOut } from "lucide-react";

const AdminEnquiries = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["enquiries"],
    queryFn: enquiryApi.getAllEnquiries,
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get unique statuses for filter
  const uniqueStatuses = useMemo(() => {
    if (!data?.data) return [];
    const statuses = new Set(data.data.map((e) => e.currentStatus));
    return Array.from(statuses);
  }, [data]);

  // Filter and search
  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.filter((enquiry) => {
      const matchesSearch =
        search === "" ||
        enquiry.name.toLowerCase().includes(search.toLowerCase()) ||
        enquiry.trackingId.toLowerCase().includes(search.toLowerCase()) ||
        enquiry.mobile.includes(search) ||
        enquiry.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || enquiry.currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const handleViewDetails = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setDetailsModalOpen(true);
  };

  const handleUpdateStatus = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setUpdateModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "enquiry submitted":
        return "secondary";
      case "under review":
        return "outline";
      case "court hiring":
        return "default";
      default:
        return "secondary";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-foreground">All Enquiries</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Enquiry List</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, tracking ID, mobile, or email..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Failed to load enquiries. Please check your API connection.
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No enquiries found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Mobile</TableHead>
                      <TableHead className="hidden lg:table-cell">Email</TableHead>
                      <TableHead className="hidden sm:table-cell">Case Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((enquiry) => (
                      <TableRow key={enquiry._id}>
                        <TableCell className="font-mono text-sm">
                          {enquiry.trackingId}
                        </TableCell>
                        <TableCell className="font-medium">{enquiry.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {enquiry.mobile}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {enquiry.email}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {enquiry.caseType}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(enquiry.currentStatus)}>
                            {enquiry.currentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(new Date(enquiry.createdAt), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(enquiry)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateStatus(enquiry)}
                              title="Update Status"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Results count */}
            {!isLoading && !error && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredData.length} of {data?.total || 0} enquiries
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <EnquiryDetailsModal
        enquiry={selectedEnquiry}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />
      <UpdateStatusModal
        enquiry={selectedEnquiry}
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      />
    </div>
  );
};

export default AdminEnquiries;
