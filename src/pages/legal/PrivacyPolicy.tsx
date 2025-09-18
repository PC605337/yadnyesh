import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, Database, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const lastUpdated = "September 18, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-6">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Your Privacy Matters</CardTitle>
              <CardDescription>
                At HealthCare+, we are committed to protecting your privacy and ensuring the security of your personal health information.
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-green-50">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <p className="text-green-800 font-semibold">End-to-End Encryption</p>
                  <p className="text-green-700 text-sm">All your health data is encrypted both in transit and at rest using industry-standard AES-256 encryption.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4>Personal Information</h4>
              <ul>
                <li><strong>Identity Information:</strong> Name, date of birth, gender, contact details</li>
                <li><strong>Authentication Data:</strong> Email address, encrypted passwords, verification documents</li>
                <li><strong>Payment Information:</strong> Billing details, payment method information (processed securely through PCI-compliant gateways)</li>
              </ul>

              <h4>Health Information (Protected Health Information - PHI)</h4>
              <ul>
                <li>Medical history and current health conditions</li>
                <li>Prescription and medication information</li>
                <li>Lab results and diagnostic reports</li>
                <li>Consultation notes and treatment plans</li>
                <li>Mental health and wellness data</li>
                <li>Insurance and coverage information</li>
              </ul>

              <h4>Technical Information</h4>
              <ul>
                <li>Device information and browser type</li>
                <li>IP address and location data (for security purposes)</li>
                <li>Usage patterns and app interactions</li>
                <li>Log files and error reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4>Primary Healthcare Purposes</h4>
              <ul>
                <li><strong>Treatment:</strong> Facilitating consultations and care coordination</li>
                <li><strong>Payment:</strong> Processing healthcare payments and insurance claims</li>
                <li><strong>Operations:</strong> Quality improvement and platform optimization</li>
              </ul>

              <h4>Platform Services</h4>
              <ul>
                <li>Account creation and authentication</li>
                <li>Appointment scheduling and management</li>
                <li>Prescription and pharmacy services</li>
                <li>Health records management</li>
                <li>Emergency contact notifications</li>
              </ul>

              <h4>Legal and Safety Requirements</h4>
              <ul>
                <li>Compliance with healthcare regulations</li>
                <li>Fraud prevention and security monitoring</li>
                <li>Legal proceedings when required by law</li>
                <li>Emergency situations requiring immediate care</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <p className="text-blue-800 font-semibold">Your Consent is Required</p>
                <p className="text-blue-700">We never share your health information without your explicit consent, except in specific legal or emergency situations outlined below.</p>
              </div>

              <h4>With Your Consent</h4>
              <ul>
                <li><strong>Healthcare Providers:</strong> Doctors and specialists you choose to consult</li>
                <li><strong>Care Coordinators:</strong> Nurses and support staff involved in your care</li>
                <li><strong>Family Members:</strong> Emergency contacts you designate</li>
                <li><strong>Insurance Providers:</strong> For claims processing and coverage verification</li>
              </ul>

              <h4>Without Consent (Limited Circumstances)</h4>
              <ul>
                <li><strong>Medical Emergencies:</strong> Life-threatening situations requiring immediate care</li>
                <li><strong>Legal Requirements:</strong> Court orders, regulatory compliance</li>
                <li><strong>Public Health:</strong> Disease outbreaks, mandatory reporting requirements</li>
                <li><strong>Safety Concerns:</strong> Threats to yourself or others</li>
              </ul>

              <h4>Service Providers</h4>
              <p>We work with trusted third-party providers who:</p>
              <ul>
                <li>Sign comprehensive data protection agreements</li>
                <li>Use information only for specified services</li>
                <li>Meet or exceed our security standards</li>
                <li>Are regularly audited for compliance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4>Technical Safeguards</h4>
              <ul>
                <li><strong>Encryption:</strong> AES-256 encryption for data at rest, TLS 1.3 for data in transit</li>
                <li><strong>Access Controls:</strong> Multi-factor authentication, role-based access</li>
                <li><strong>Network Security:</strong> Firewalls, intrusion detection, regular security monitoring</li>
                <li><strong>Backup Systems:</strong> Secure, encrypted backups with disaster recovery plans</li>
              </ul>

              <h4>Administrative Safeguards</h4>
              <ul>
                <li>Regular security training for all staff</li>
                <li>Background checks for employees with data access</li>
                <li>Incident response procedures</li>
                <li>Regular security audits and penetration testing</li>
              </ul>

              <h4>Physical Safeguards</h4>
              <ul>
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Biometric access controls</li>
                <li>Environmental controls and redundant systems</li>
                <li>Secure disposal of hardware and media</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4>Access and Control</h4>
              <ul>
                <li><strong>View Your Data:</strong> Access all personal information we have about you</li>
                <li><strong>Update Information:</strong> Correct or update your personal and health information</li>
                <li><strong>Download Data:</strong> Export your health records in a portable format</li>
                <li><strong>Delete Account:</strong> Request deletion of your account and associated data</li>
              </ul>

              <h4>Communication Preferences</h4>
              <ul>
                <li>Choose how and when you receive notifications</li>
                <li>Opt out of marketing communications</li>
                <li>Set emergency contact preferences</li>
                <li>Control sharing with family members</li>
              </ul>

              <h4>Data Portability</h4>
              <p>You have the right to:</p>
              <ul>
                <li>Receive your data in a machine-readable format</li>
                <li>Transfer your health records to other providers</li>
                <li>Request transmission to third-party healthcare services</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4>Health Records</h4>
              <ul>
                <li><strong>Active Users:</strong> Maintained as long as your account is active</li>
                <li><strong>Inactive Accounts:</strong> 7 years after last activity (as per medical record requirements)</li>
                <li><strong>Legal Hold:</strong> Extended retention when required by law or ongoing legal proceedings</li>
              </ul>

              <h4>Technical Data</h4>
              <ul>
                <li><strong>Usage Logs:</strong> 1 year for security and optimization purposes</li>
                <li><strong>Security Logs:</strong> 3 years for incident investigation</li>
                <li><strong>Backup Data:</strong> Automated deletion following main data retention schedules</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>For privacy-related questions or to exercise your rights:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Privacy Officer:</strong> privacy@healthcare-plus.com</p>
                <p><strong>Phone:</strong> +91-1800-123-4567 (Privacy Hotline)</p>
                <p><strong>Mail:</strong> HealthCare+ Privacy Office, Mumbai, Maharashtra, India</p>
                <p><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy is effective as of {lastUpdated}. We will notify you of any material changes via email or platform notification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;