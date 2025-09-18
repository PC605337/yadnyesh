import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Video,
  FileText,
  Users,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful: number;
  tags: string[];
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdate: string;
  description: string;
}

const HelpSupport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [supportForm, setSupportForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TICK-001',
      subject: 'Unable to book appointment',
      category: 'appointments',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2024-09-15T10:30:00Z',
      lastUpdate: '2024-09-16T14:20:00Z',
      description: 'Getting error when trying to book appointment with Dr. Smith'
    }
  ]);

  const { toast } = useToast();

  const faqs: FAQItem[] = [
    {
      id: 'faq-001',
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click on "Sign Up" and follow the registration process. You\'ll need to provide basic information and verify your email address.',
      helpful: 45,
      tags: ['registration', 'signup', 'account']
    },
    {
      id: 'faq-002',
      category: 'appointments',
      question: 'How do I book a teleconsultation?',
      answer: 'Go to "Book Consultation", select your preferred doctor, choose an available time slot, and complete the payment. You\'ll receive a confirmation with the video call link.',
      helpful: 78,
      tags: ['booking', 'teleconsultation', 'video call']
    },
    {
      id: 'faq-003',
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept UPI, credit/debit cards, digital wallets (Paytm, Google Pay, PhonePe), net banking, and EMI options for higher amounts.',
      helpful: 62,
      tags: ['payment', 'upi', 'cards', 'emi']
    },
    {
      id: 'faq-004',
      category: 'privacy',
      question: 'How secure is my health data?',
      answer: 'All health data is encrypted with AES-256 encryption and stored in HIPAA-compliant servers. We never share your data without explicit consent.',
      helpful: 89,
      tags: ['security', 'privacy', 'hipaa', 'encryption']
    },
    {
      id: 'faq-005',
      category: 'prescriptions',
      question: 'How do I get my prescription delivered?',
      answer: 'After your consultation, the doctor will send an e-prescription. You can order medicines through our pharmacy partner and get them delivered to your address.',
      helpful: 56,
      tags: ['prescription', 'pharmacy', 'delivery']
    },
    {
      id: 'faq-006',
      category: 'insurance',
      question: 'Can I use my health insurance?',
      answer: 'Yes, we work with major insurance providers. Add your insurance details in settings and we\'ll help you with claim processing.',
      helpful: 71,
      tags: ['insurance', 'claims', 'coverage']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'account', name: 'Account & Profile', icon: <Users className="h-4 w-4" /> },
    { id: 'appointments', name: 'Appointments', icon: <Video className="h-4 w-4" /> },
    { id: 'payments', name: 'Payments & Billing', icon: <FileText className="h-4 w-4" /> },
    { id: 'privacy', name: 'Privacy & Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'prescriptions', name: 'Prescriptions', icon: <FileText className="h-4 w-4" /> },
    { id: 'insurance', name: 'Insurance', icon: <Shield className="h-4 w-4" /> }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = () => {
    if (!supportForm.subject || !supportForm.category || !supportForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newTicket: SupportTicket = {
      id: `TICK-${Date.now()}`,
      subject: supportForm.subject,
      category: supportForm.category,
      priority: supportForm.priority as any,
      status: 'open',
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      description: supportForm.description
    };

    setTickets(prev => [newTicket, ...prev]);
    setSupportForm({
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    });

    toast({
      title: "Support Ticket Created",
      description: `Your ticket ${newTicket.id} has been submitted. We'll respond within 24 hours.`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Help & Support Center
          </CardTitle>
          <CardDescription>
            Get help with HealthCare+ services, find answers to common questions, or contact our support team
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center gap-2"
                    >
                      {category.icon}
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ List */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                {filteredFAQs.length} questions found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No FAQs found matching your search criteria</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-muted-foreground">{faq.answer}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {faq.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4" />
                              {faq.helpful} people found this helpful
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Available 24/7 for emergencies<br />
                  9 AM - 9 PM for general support
                </p>
                <p className="font-medium">+91-1800-123-4567</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Chat with our support team<br />
                  Average response: 2-5 minutes
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Email us your questions<br />
                  Response within 24 hours
                </p>
                <p className="font-medium">support@healthcare-plus.com</p>
              </CardContent>
            </Card>
          </div>

          {/* Support Ticket Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Submit a ticket and our team will help you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject *</label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={supportForm.category}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    <option value="account">Account & Profile</option>
                    <option value="appointments">Appointments</option>
                    <option value="payments">Payments & Billing</option>
                    <option value="technical">Technical Issues</option>
                    <option value="privacy">Privacy & Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <select
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  value={supportForm.priority}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">Low - General question</option>
                  <option value="medium">Medium - Issue affecting usage</option>
                  <option value="high">High - Serious problem</option>
                  <option value="urgent">Urgent - Critical issue</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <Textarea
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                  rows={4}
                  value={supportForm.description}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button onClick={handleSubmitTicket} className="w-full">
                Submit Support Ticket
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>
                Track the status of your support requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No support tickets yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{ticket.subject}</h4>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>ID: {ticket.id}</span>
                              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                              <span>Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium">How to Book Your First Consultation</h4>
                  <p className="text-sm text-muted-foreground">3:45 mins</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium">Setting Up Your Health Profile</h4>
                  <p className="text-sm text-muted-foreground">2:20 mins</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium">Using the Digital Wallet</h4>
                  <p className="text-sm text-muted-foreground">4:10 mins</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  User Guides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium">Patient User Guide</h4>
                  <p className="text-sm text-muted-foreground">Complete guide for patients</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium">Privacy & Security Guide</h4>
                  <p className="text-sm text-muted-foreground">Understanding your data protection</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium">Payment Methods Guide</h4>
                  <p className="text-sm text-muted-foreground">All about payments and billing</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">Support Hours</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Emergency Support:</strong> 24/7 available</p>
                    <p><strong>General Support:</strong> Monday - Sunday, 9 AM - 9 PM IST</p>
                    <p><strong>Technical Support:</strong> Monday - Friday, 9 AM - 6 PM IST</p>
                    <p><strong>Billing Support:</strong> Monday - Friday, 10 AM - 6 PM IST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupport;