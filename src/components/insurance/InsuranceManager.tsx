import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  CreditCard, 
  FileText, 
  Calendar, 
  DollarSign,
  Plus,
  Eye,
  Download,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insuranceClaimSchema } from "@/utils/validationSchemas";
import { z } from "zod";

type InsuranceClaimFormData = z.infer<typeof insuranceClaimSchema>;

interface PatientInsurance {
  id: string;
  patient_id: string;
  provider_id: string;
  policy_number: string;
  policy_type: string;
  policy_start_date: string;
  policy_end_date: string;
  premium_amount?: number;
  deductible_amount?: number;
  copay_percentage?: number;
  coverage_amount?: number;
  covered_services: string[];
  exclusions: string[];
  beneficiaries: any[];
  is_active: boolean;
  provider?: {
    name: string;
    provider_code: string;
  };
}

interface InsuranceClaim {
  id: string;
  patient_id: string;
  claim_number: string;
  insurance_provider: string;
  policy_number: string;
  claim_amount: number;
  submitted_date: string;
  processed_date?: string;
  status: 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid';
  documents?: any;
  appointment_id?: string;
}

export function InsuranceManager() {
  const { user } = useAuth();
  const [insurances, setInsurances] = useState<PatientInsurance[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingInsurance, setIsAddingInsurance] = useState(false);
  const [isFilingClaim, setIsFilingClaim] = useState(false);

  const [newInsurance, setNewInsurance] = useState({
    provider_id: '',
    policy_number: '',
    policy_type: '',
    policy_start_date: '',
    policy_end_date: '',
    premium_amount: 0,
    deductible_amount: 0,
    copay_percentage: 0,
    coverage_amount: 0
  });

  const { register, handleSubmit, formState: { errors }, reset: resetClaimForm } = useForm<InsuranceClaimFormData>({
    resolver: zodResolver(insuranceClaimSchema)
  });

  useEffect(() => {
    if (user) {
      fetchInsuranceData();
    }
  }, [user]);

  const fetchInsuranceData = async () => {
    try {
      // Fetch patient insurance policies
      const { data: insuranceData, error: insuranceError } = await supabase
        .from('patient_insurance')
        .select(`
          *,
          provider:insurance_providers!inner(name, provider_code)
        `)
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false });

      if (insuranceError) throw insuranceError;
      setInsurances((insuranceData || []).map(ins => ({
        ...ins,
        covered_services: Array.isArray(ins.covered_services) ? ins.covered_services.map(String) : [],
        exclusions: Array.isArray(ins.exclusions) ? ins.exclusions.map(String) : [],
        beneficiaries: Array.isArray(ins.beneficiaries) ? ins.beneficiaries : []
      })));

      // Fetch insurance claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('insurance_claims')
        .select('*')
        .eq('patient_id', user?.id)
        .order('submitted_date', { ascending: false });

      if (claimsError) throw claimsError;  
      setClaims((claimsData || []).map(claim => ({
        ...claim,
        status: claim.status as 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
      })));
    } catch (error) {
      console.error('Error fetching insurance data:', error);
      toast.error('Failed to load insurance information');
    } finally {
      setLoading(false);
    }
  };

  const addInsurance = async () => {
    try {
      const { error } = await supabase
        .from('patient_insurance')
        .insert({
          ...newInsurance,
          patient_id: user?.id,
          covered_services: [],
          exclusions: [],
          beneficiaries: [],
          is_active: true
        });

      if (error) throw error;

      toast.success('Insurance policy added successfully!');
      setIsAddingInsurance(false);
      setNewInsurance({
        provider_id: '',
        policy_number: '',
        policy_type: '',
        policy_start_date: '',
        policy_end_date: '',
        premium_amount: 0,
        deductible_amount: 0,
        copay_percentage: 0,
        coverage_amount: 0
      });
      fetchInsuranceData();
    } catch (error) {
      console.error('Error adding insurance:', error);
      toast.error('Failed to add insurance policy');
    }
  };

  const fileClaim = async (data: InsuranceClaimFormData) => {
    try {
      const claimNumber = `CLM-${Date.now()}`;
      
      const { error } = await supabase
        .from('insurance_claims')
        .insert({
          patient_id: user?.id,
          insurance_provider: data.insurance_provider,
          policy_number: data.policy_number,
          claim_amount: data.claim_amount,
          appointment_id: data.appointment_id || null,
          claim_number: claimNumber,
          status: 'submitted',
          submitted_date: new Date().toISOString(),
          documents: {
            description: data.description,
            service_date: data.service_date,
            diagnosis: data.diagnosis
          }
        });

      if (error) throw error;

      toast.success('Insurance claim filed successfully! You will receive updates via notifications.');
      setIsFilingClaim(false);
      resetClaimForm();
      fetchInsuranceData();
    } catch (error) {
      console.error('Error filing claim:', error);
      toast.error('Failed to file insurance claim');
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'submitted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClaimStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'submitted': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div>Loading insurance information...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Insurance Management</h1>
          <p className="text-muted-foreground">Manage your insurance policies and claims</p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isAddingInsurance} onOpenChange={setIsAddingInsurance}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Insurance Policy</DialogTitle>
                <DialogDescription>
                  Add a new insurance policy to your profile
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policy_number">Policy Number</Label>
                    <Input
                      placeholder="Enter policy number"
                      value={newInsurance.policy_number}
                      onChange={(e) => setNewInsurance({...newInsurance, policy_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="policy_type">Policy Type</Label>
                    <Select value={newInsurance.policy_type} onValueChange={(value) => 
                      setNewInsurance({...newInsurance, policy_type: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health Insurance</SelectItem>
                        <SelectItem value="dental">Dental Insurance</SelectItem>
                        <SelectItem value="vision">Vision Insurance</SelectItem>
                        <SelectItem value="life">Life Insurance</SelectItem>
                        <SelectItem value="disability">Disability Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      type="date"
                      value={newInsurance.policy_start_date}
                      onChange={(e) => setNewInsurance({...newInsurance, policy_start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      type="date"
                      value={newInsurance.policy_end_date}
                      onChange={(e) => setNewInsurance({...newInsurance, policy_end_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="premium">Premium Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newInsurance.premium_amount}
                      onChange={(e) => setNewInsurance({...newInsurance, premium_amount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deductible">Deductible</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newInsurance.deductible_amount}
                      onChange={(e) => setNewInsurance({...newInsurance, deductible_amount: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <Button onClick={addInsurance} className="w-full">
                  Add Insurance Policy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isFilingClaim} onOpenChange={setIsFilingClaim}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                File Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>File Insurance Claim</DialogTitle>
                <DialogDescription>
                  Submit a new insurance claim with required documentation
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(fileClaim)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="insurance_provider">Insurance Provider *</Label>
                    <select 
                      {...register('insurance_provider')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select provider</option>
                      {insurances.map((insurance) => (
                        <option key={insurance.id} value={insurance.provider?.name || ''}>
                          {insurance.provider?.name} - {insurance.policy_number}
                        </option>
                      ))}
                    </select>
                    {errors.insurance_provider && (
                      <p className="text-sm text-destructive mt-1">{errors.insurance_provider.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="policy_number">Policy Number *</Label>
                    <Input {...register('policy_number')} placeholder="Enter policy number" />
                    {errors.policy_number && (
                      <p className="text-sm text-destructive mt-1">{errors.policy_number.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="claim_amount">Claim Amount (₹) *</Label>
                    <Input 
                      type="number" 
                      {...register('claim_amount', { valueAsNumber: true })} 
                      placeholder="0.00" 
                    />
                    {errors.claim_amount && (
                      <p className="text-sm text-destructive mt-1">{errors.claim_amount.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="service_date">Service Date *</Label>
                    <Input type="date" {...register('service_date')} />
                    {errors.service_date && (
                      <p className="text-sm text-destructive mt-1">{errors.service_date.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="appointment_id">Appointment ID (Optional)</Label>
                    <Input {...register('appointment_id')} placeholder="Appointment reference" />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="diagnosis">Diagnosis *</Label>
                    <Textarea 
                      {...register('diagnosis')} 
                      placeholder="Brief diagnosis or reason for claim"
                      rows={2}
                    />
                    {errors.diagnosis && (
                      <p className="text-sm text-destructive mt-1">{errors.diagnosis.message}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="description">Claim Description *</Label>
                    <Textarea 
                      {...register('description')} 
                      placeholder="Detailed description of treatment/services provided (min 10 characters)"
                      rows={3}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="col-span-2 p-4 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900">Required Documents</p>
                        <p className="text-blue-700 mt-1">
                          Please keep the following ready: Medical bills, prescription, diagnostic reports, and doctor's notes. You can upload them after claim submission.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Submit Claim for Review
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold">{insurances.filter(i => i.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{claims.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Claims</p>
                <p className="text-2xl font-bold">
                  {claims.filter(c => ['submitted', 'processing'].includes(c.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="w-full">
        <TabsList>
          <TabsTrigger value="policies">Insurance Policies ({insurances.length})</TabsTrigger>
          <TabsTrigger value="claims">Claims ({claims.length})</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="policies" className="space-y-4">
          {insurances.map((insurance) => (
            <Card key={insurance.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>{insurance.provider?.name}</span>
                      <Badge variant={insurance.is_active ? "default" : "secondary"}>
                        {insurance.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Policy: {insurance.policy_number} • Type: {insurance.policy_type}
                    </CardDescription>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download Card
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Premium</p>
                    <p className="text-lg font-semibold">₹{insurance.premium_amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deductible</p>
                    <p className="text-lg font-semibold">₹{insurance.deductible_amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Coverage</p>
                    <p className="text-lg font-semibold">₹{insurance.coverage_amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Copay</p>
                    <p className="text-lg font-semibold">{insurance.copay_percentage}%</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Valid: {new Date(insurance.policy_start_date).toLocaleDateString()} - {new Date(insurance.policy_end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="claims" className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Claim #{claim.claim_number}</span>
                      <Badge variant="outline" className={getClaimStatusColor(claim.status)}>
                        {getClaimStatusIcon(claim.status)}
                        <span className="ml-1 capitalize">{claim.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {claim.insurance_provider} • Policy: {claim.policy_number}
                    </CardDescription>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold">₹{claim.claim_amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Filed: {new Date(claim.submitted_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              {claim.processed_date && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Processed: {new Date(claim.processed_date).toLocaleDateString()}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="coverage">
          <div className="space-y-4">
            {insurances.filter(i => i.is_active).map((insurance) => (
              <Card key={insurance.id}>
                <CardHeader>
                  <CardTitle>{insurance.provider?.name} Coverage Details</CardTitle>
                  <CardDescription>Policy: {insurance.policy_number}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Covered Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {insurance.covered_services.length > 0 ? (
                          insurance.covered_services.map((service, index) => (
                            <Badge key={index} variant="secondary">{service}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No specific services listed</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Exclusions</h4>
                      <div className="flex flex-wrap gap-2">
                        {insurance.exclusions.length > 0 ? (
                          insurance.exclusions.map((exclusion, index) => (
                            <Badge key={index} variant="outline">{exclusion}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No exclusions listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}