import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>System settings interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}