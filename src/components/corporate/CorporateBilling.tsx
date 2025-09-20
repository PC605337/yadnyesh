import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, Download, CreditCard, Clock, CheckCircle, AlertCircle, DollarSign, Calendar, TrendingUp } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  description: string;
  services: {
    name: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
  paymentMethod?: string;
  paidDate?: string;
}

interface Subscription {
  id: string;
  plan: string;
  employees: number;
  monthlyRate: number;
  startDate: string;
  nextBilling: string;
  status: "active" | "cancelled" | "suspended";
  features: string[];
}

export function CorporateBilling() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      date: "2024-01-01",
      dueDate: "2024-01-31",
      amount: 45000,
      status: "paid",
      description: "Monthly wellness program subscription - January 2024",
      services: [
        { name: "Employee Wellness Platform", quantity: 195, rate: 200, total: 39000 },
        { name: "Health Screenings", quantity: 50, rate: 120, total: 6000 }
      ],
      paymentMethod: "Bank Transfer",
      paidDate: "2024-01-28"
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      date: "2024-02-01",
      dueDate: "2024-02-29",
      amount: 47500,
      status: "paid",
      description: "Monthly wellness program subscription - February 2024",
      services: [
        { name: "Employee Wellness Platform", quantity: 195, rate: 200, total: 39000 },
        { name: "Health Screenings", quantity: 60, rate: 120, total: 7200 },
        { name: "Mental Health Workshops", quantity: 2, rate: 650, total: 1300 }
      ],
      paymentMethod: "UPI",
      paidDate: "2024-02-25"
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      date: "2024-03-01",
      dueDate: "2024-03-31",
      amount: 52000,
      status: "pending",
      description: "Monthly wellness program subscription - March 2024",
      services: [
        { name: "Employee Wellness Platform", quantity: 200, rate: 200, total: 40000 },
        { name: "Health Screenings", quantity: 70, rate: 120, total: 8400 },
        { name: "Fitness Program", quantity: 120, rate: 30, total: 3600 }
      ]
    },
    {
      id: "4",
      invoiceNumber: "INV-2023-012",
      date: "2023-12-01",
      dueDate: "2023-12-31",
      amount: 38000,
      status: "overdue",
      description: "Monthly wellness program subscription - December 2023",
      services: [
        { name: "Employee Wellness Platform", quantity: 190, rate: 200, total: 38000 }
      ]
    }
  ]);

  const [subscription] = useState<Subscription>({
    id: "1",
    plan: "Enterprise",
    employees: 200,
    monthlyRate: 200,
    startDate: "2023-01-01",
    nextBilling: "2024-04-01",
    status: "active",
    features: [
      "Unlimited health screenings",
      "Mental health support",
      "Fitness programs",
      "Nutrition consultations",
      "24/7 support",
      "Analytics dashboard",
      "Custom reporting"
    ]
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handlePayInvoice = (invoiceId: string) => {
    toast({
      title: "Payment Initiated",
      description: "Invoice payment has been initiated successfully.",
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: "Invoice PDF download has started.",
    });
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === "paid").length;
  const pendingAmount = invoices.filter(i => i.status === "pending" || i.status === "overdue")
                              .reduce((sum, i) => sum + i.amount, 0);
  const monthlySpend = invoices.filter(i => i.date.startsWith("2024-")).reduce((sum, i) => sum + i.amount, 0) / 3;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing & Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button>
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{totalInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Paid Invoices</p>
                <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Monthly Spend</p>
                <p className="text-2xl font-bold">₹{Math.round(monthlySpend).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices by number or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoices List */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{invoice.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Date: {new Date(invoice.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ₹{invoice.amount.toLocaleString()}
                          </span>
                          {invoice.paidDate && (
                            <span>Paid: {new Date(invoice.paidDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        {(invoice.status === "pending" || invoice.status === "overdue") && (
                          <Button 
                            size="sm"
                            onClick={() => handlePayInvoice(invoice.id)}
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Pay Now
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Invoice Details - {selectedInvoice?.invoiceNumber}</DialogTitle>
                            </DialogHeader>
                            {selectedInvoice && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Invoice Number</Label>
                                    <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                                  </div>
                                  <div>
                                    <Label>Date</Label>
                                    <p className="font-medium">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <Label>Due Date</Label>
                                    <p className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <Label>Total Amount</Label>
                                    <p className="font-medium text-lg">₹{selectedInvoice.amount.toLocaleString()}</p>
                                  </div>
                                  {selectedInvoice.paymentMethod && (
                                    <div>
                                      <Label>Payment Method</Label>
                                      <p className="font-medium">{selectedInvoice.paymentMethod}</p>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <Label>Services</Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedInvoice.services.map((service, index) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                        <div>
                                          <p className="font-medium">{service.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {service.quantity} × ₹{service.rate}
                                          </p>
                                        </div>
                                        <p className="font-medium">₹{service.total.toLocaleString()}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  <Button size="sm" onClick={() => handleDownloadInvoice(selectedInvoice.id)}>
                                    <Download className="w-4 h-4 mr-1" />
                                    Download PDF
                                  </Button>
                                  {(selectedInvoice.status === "pending" || selectedInvoice.status === "overdue") && (
                                    <Button size="sm" onClick={() => handlePayInvoice(selectedInvoice.id)}>
                                      <CreditCard className="w-4 h-4 mr-1" />
                                      Pay Invoice
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan</Label>
                  <p className="font-medium text-lg">{subscription.plan}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div>
                  <Label>Employees Covered</Label>
                  <p className="font-medium">{subscription.employees}</p>
                </div>
                <div>
                  <Label>Monthly Rate per Employee</Label>
                  <p className="font-medium">₹{subscription.monthlyRate}</p>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Next Billing</Label>
                  <p className="font-medium">{new Date(subscription.nextBilling).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label>Included Features</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Upgrade Plan</Button>
                <Button variant="outline">Modify Coverage</Button>
                <Button variant="outline">View Usage</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium">Bank Transfer (Primary)</p>
                        <p className="text-sm text-muted-foreground">HDFC Bank - ****2847</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-medium">UPI (Backup)</p>
                        <p className="text-sm text-muted-foreground">techcorp@paytm</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Backup</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Add Payment Method</Button>
                <Button variant="outline">Update Bank Details</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}