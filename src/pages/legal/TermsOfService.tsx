import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const lastUpdated = "September 18, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                By accessing and using HealthCare+ ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service govern your use of our healthcare platform, including all services, features, content, and applications offered by HealthCare+ (collectively, "Services").
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
                <p className="text-amber-800 font-semibold mb-2">⚠️ Important Medical Disclaimer</p>
                <p className="text-amber-700">
                  HealthCare+ is a platform that connects patients with healthcare providers. We do not provide medical advice, diagnosis, or treatment. All medical decisions should be made in consultation with qualified healthcare professionals.
                </p>
              </div>
              
              <h4>No Doctor-Patient Relationship</h4>
              <p>
                Use of this platform does not create a doctor-patient relationship between you and HealthCare+ or any healthcare provider until you explicitly enter into a consultation with a verified provider on our platform.
              </p>

              <h4>Emergency Situations</h4>
              <p>
                This platform is not intended for emergency medical situations. In case of a medical emergency, immediately call your local emergency services (108 in India) or visit the nearest emergency room.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use of Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4>Eligibility</h4>
              <p>You must be at least 18 years old to use this service. If you are under 18, you may use the service only with the involvement of a parent or guardian.</p>

              <h4>Account Registration</h4>
              <ul>
                <li>You must provide accurate and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>Each user may maintain only one account</li>
              </ul>

              <h4>Prohibited Uses</h4>
              <p>You agree not to use the service to:</p>
              <ul>
                <li>Violate any laws or regulations</li>
                <li>Share false, misleading, or fraudulent information</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Spam or send unsolicited communications</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Healthcare Provider Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                All healthcare providers on our platform undergo verification through the National Medical Register (NMR) and other relevant medical boards. However:
              </p>
              <ul>
                <li>We verify credentials but do not guarantee the quality of care</li>
                <li>Patients should always verify provider credentials independently</li>
                <li>Any concerns about provider conduct should be reported immediately</li>
                <li>Final responsibility for healthcare decisions rests with patients and their chosen providers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h4>Fees and Charges</h4>
              <ul>
                <li>All fees are clearly displayed before payment</li>
                <li>Payments are processed securely through verified payment gateways</li>
                <li>Platform fees may apply to certain transactions</li>
                <li>Refunds are subject to our refund policy</li>
              </ul>

              <h4>Refund Policy</h4>
              <ul>
                <li>Consultation fees may be refunded if cancelled 24 hours in advance</li>
                <li>Emergency cancellations by providers result in full refunds</li>
                <li>Refunds are processed within 5-7 business days</li>
                <li>Dispute resolution follows our established procedures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>, which is incorporated into these Terms of Service by reference.
              </p>
              
              <h4>Health Information</h4>
              <ul>
                <li>All health information is encrypted and securely stored</li>
                <li>We comply with applicable data protection regulations</li>
                <li>You control who has access to your health information</li>
                <li>Data retention policies are clearly defined in our Privacy Policy</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800">
                  <strong>DISCLAIMER:</strong> HealthCare+ provides a platform service only. We are not liable for any medical outcomes, misdiagnoses, treatment failures, or any other healthcare-related issues that may arise from use of our platform.
                </p>
              </div>
              
              <p>
                Our liability is limited to the maximum extent permitted by law. In no event shall HealthCare+ be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> legal@healthcare-plus.com</p>
                <p><strong>Phone:</strong> +91-1800-123-4567</p>
                <p><strong>Address:</strong> Healthcare+ Legal Department, Mumbai, Maharashtra, India</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              By continuing to use HealthCare+, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;