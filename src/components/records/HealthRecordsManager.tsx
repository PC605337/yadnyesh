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
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Plus,
  Calendar,
  User,
  Shield,
  Activity,
  Heart,
  Brain,
  Stethoscope,
  TestTube,
  Camera,
  File
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface HealthRecord {
  id: string;
  patient_id: string;
  provider_id?: string;
  type: string;
  title: string;
  data: any;
  recorded_date: string;
  file_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  provider?: {
    first_name: string;
    last_name: string;
  };
}

const recordTypes = [
  { value: 'lab_results', label: 'Lab Results', icon: TestTube },
  { value: 'imaging', label: 'Medical Imaging', icon: Camera },
  { value: 'vital_signs', label: 'Vital Signs', icon: Activity },
  { value: 'medication_history', label: 'Medication History', icon: Heart },
  { value: 'consultation_notes', label: 'Consultation Notes', icon: Stethoscope },
  { value: 'surgical_records', label: 'Surgical Records', icon: FileText },
  { value: 'vaccination_records', label: 'Vaccination Records', icon: Shield },
  { value: 'allergy_information', label: 'Allergy Information', icon: Brain },
  { value: 'discharge_summary', label: 'Discharge Summary', icon: File },
  { value: 'other', label: 'Other', icon: FileText },
];

export function HealthRecordsManager() {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [newRecord, setNewRecord] = useState({
    type: '',
    title: '',
    data: {},
    recorded_date: new Date().toISOString().split('T')[0],
    file_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchHealthRecords();
    }
  }, [user]);

  const fetchHealthRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          provider:provider_profiles(
            user:profiles!inner(first_name, last_name)
          )
        `)
        .eq('patient_id', user?.id)
        .order('recorded_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching health records:', error);
      toast.error('Failed to load health records');
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async () => {
    try {
      let fileUrl = newRecord.file_url;
      
      // Handle file upload if present
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('health-records')
          .upload(fileName, uploadFile);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('health-records')
          .getPublicUrl(fileName);
        
        fileUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('health_records')
        .insert({
          ...newRecord,
          patient_id: user?.id,
          file_url: fileUrl,
          data: newRecord.data || {}
        });

      if (error) throw error;

      toast.success('Health record added successfully!');
      setIsAddingRecord(false);
      setNewRecord({
        type: '',
        title: '',
        data: {},
        recorded_date: new Date().toISOString().split('T')[0],
        file_url: ''
      });
      setUploadFile(null);
      fetchHealthRecords();
    } catch (error) {
      console.error('Error adding health record:', error);
      toast.error('Failed to add health record');
    }
  };

  const downloadRecord = async (record: HealthRecord) => {
    if (record.file_url) {
      window.open(record.file_url, '_blank');
    } else {
      // Create a downloadable JSON file
      const dataStr = JSON.stringify(record, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${record.title.replace(/\s+/g, '_')}_${record.recorded_date}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const getRecordIcon = (type: string) => {
    const recordType = recordTypes.find(rt => rt.value === type);
    const IconComponent = recordType?.icon || FileText;
    return <IconComponent className="h-5 w-5" />;
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const recordsByType = recordTypes.map(type => ({
    ...type,
    count: records.filter(r => r.type === type.value).length
  }));

  if (loading) {
    return <div>Loading health records...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Health Records</h1>
          <p className="text-muted-foreground">Manage and view your medical records</p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
                <DialogDescription>
                  Add a new medical record to your health profile
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Record Type</Label>
                  <Select value={newRecord.type} onValueChange={(value) => 
                    setNewRecord({...newRecord, type: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      {recordTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    placeholder="Enter record title..."
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Record Date</Label>
                  <Input
                    type="date"
                    value={newRecord.recorded_date}
                    onChange={(e) => setNewRecord({...newRecord, recorded_date: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="file">Upload File (Optional)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
                
                <Button onClick={addRecord} className="w-full">
                  Add Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {recordTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {recordsByType.slice(0, 5).map((type) => (
          <Card key={type.value} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedType(type.value)}>
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <type.icon className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{type.count}</p>
                  <p className="text-xs text-muted-foreground">{type.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList>
          <TabsTrigger value="records">All Records ({filteredRecords.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified Only</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records" className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getRecordIcon(record.type)}
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{record.title}</span>
                        {record.is_verified && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {record.provider && (
                          <span className="flex items-center space-x-1 mb-1">
                            <User className="h-3 w-3" />
                            <span>Dr. {record.provider.first_name} {record.provider.last_name}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(record.recorded_date).toLocaleDateString()}</span>
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadRecord(record)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {Object.keys(record.data).length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(record.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-4">
          {filteredRecords.filter(r => r.is_verified).map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      {getRecordIcon(record.type)}
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{record.title}</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {record.provider && (
                          <span>Dr. {record.provider.first_name} {record.provider.last_name} • </span>
                        )}
                        {new Date(record.recorded_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadRecord(record)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="timeline">
          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <div key={record.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  {index < filteredRecords.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mt-2"></div>
                  )}
                </div>
                
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{record.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(record.recorded_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {recordTypes.find(t => t.value === record.type)?.label}
                      {record.provider && (
                        <span> • Dr. {record.provider.first_name} {record.provider.last_name}</span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}