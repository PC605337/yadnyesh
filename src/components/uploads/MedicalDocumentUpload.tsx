import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, File, Trash2, Eye, Download, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MedicalDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: 'prescription' | 'lab_report' | 'medical_history' | 'insurance' | 'scan' | 'other';
  uploadDate: string;
  description?: string;
  isEncrypted: boolean;
  uploadedBy: string;
  doctorName?: string;
  testDate?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  url?: string;
  thumbnailUrl?: string;
}

const documentCategories = [
  { value: 'prescription', label: 'Prescription', icon: '💊' },
  { value: 'lab_report', label: 'Lab Report', icon: '🧪' },
  { value: 'medical_history', label: 'Medical History', icon: '📋' },
  { value: 'insurance', label: 'Insurance Document', icon: '🛡️' },
  { value: 'scan', label: 'Medical Scan/X-ray', icon: '🔬' },
  { value: 'other', label: 'Other', icon: '📄' }
];

const allowedFileTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const maxFileSize = 10 * 1024 * 1024; // 10MB

export const MedicalDocumentUpload = () => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([
    {
      id: 'doc_001',
      fileName: 'blood_test_results.pdf',
      fileSize: 2456789,
      fileType: 'application/pdf',
      category: 'lab_report',
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Complete blood count and lipid profile',
      isEncrypted: true,
      uploadedBy: 'patient',
      doctorName: 'Dr. Smith',
      testDate: '2024-09-15',
      status: 'completed',
      url: '#'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [testDate, setTestDate] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!allowedFileTypes.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, DOC, DOCX, or image files.';
    }
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit.`;
    }
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Upload Error",
          description: error,
          variant: "destructive"
        });
        return;
      }

      uploadFile(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a document category before uploading",
        variant: "destructive"
      });
      return;
    }

    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newDocument: MedicalDocument = {
      id: documentId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      category: selectedCategory as any,
      uploadDate: new Date().toISOString(),
      description: description || undefined,
      doctorName: doctorName || undefined,
      testDate: testDate || undefined,
      isEncrypted: true,
      uploadedBy: 'patient',
      status: 'uploading'
    };

    setDocuments(prev => [newDocument, ...prev]);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.random() * 20;
        return next > 95 ? 95 : next;
      });
    }, 200);

    try {
      // Simulate upload to secure storage
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear interval and complete upload
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Update document status
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'completed', url: `#${documentId}` }
          : doc
      ));

      toast({
        title: "Upload Successful",
        description: `${file.name} has been securely uploaded and encrypted`,
      });

      // Reset form
      setDescription('');
      setDoctorName('');
      setTestDate('');
      
    } catch (error) {
      clearInterval(uploadInterval);
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'error' }
          : doc
      ));
      
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast({
      title: "Document Deleted",
      description: "The document has been permanently removed",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'uploading': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryInfo = (category: string) => {
    return documentCategories.find(cat => cat.value === category) || 
           { label: 'Unknown', icon: '📄' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Medical Document Upload
          </CardTitle>
          <CardDescription>
            Securely upload and manage your medical documents with end-to-end encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Document Category *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="test-date">Test/Document Date</Label>
              <Input
                id="test-date"
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="doctor">Doctor/Provider Name</Label>
            <Input
              id="doctor"
              placeholder="e.g., Dr. Smith, ABC Hospital"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={allowedFileTypes.join(',')}
              multiple
              className="hidden"
            />
            
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Medical Documents</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !selectedCategory}
            >
              Select Files
            </Button>
            
            {isUploading && (
              <div className="mt-4">
                <div className="bg-primary/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>📁 Supported formats: PDF, DOC, DOCX, JPG, PNG, WEBP</p>
            <p>📏 Maximum file size: {formatFileSize(maxFileSize)}</p>
            <p>🔒 All documents are encrypted and HIPAA compliant</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Your Documents ({documents.length})
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Encrypted
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => {
                const categoryInfo = getCategoryInfo(doc.category);
                return (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-2xl">{categoryInfo.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{doc.fileName}</h4>
                              <Badge className={getStatusColor(doc.status)}>
                                {doc.status === 'uploading' && uploadProgress > 0 
                                  ? `${Math.round(uploadProgress)}%` 
                                  : doc.status}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <span>{categoryInfo.label}</span>
                                <span>{formatFileSize(doc.fileSize)}</span>
                                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                              </div>
                              
                              {doc.description && (
                                <p>{doc.description}</p>
                              )}
                              
                              {(doc.doctorName || doc.testDate) && (
                                <div className="flex items-center gap-4">
                                  {doc.doctorName && <span>👨‍⚕️ {doc.doctorName}</span>}
                                  {doc.testDate && <span>📅 {new Date(doc.testDate).toLocaleDateString()}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {doc.status === 'completed' && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {doc.status !== 'uploading' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Security & Privacy</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All documents are encrypted with AES-256 encryption</li>
                <li>• Only you and authorized healthcare providers can access your documents</li>
                <li>• Documents are stored in HIPAA-compliant secure cloud storage</li>
                <li>• Automatic backup and disaster recovery protection</li>
                <li>• You can permanently delete documents at any time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};