import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}