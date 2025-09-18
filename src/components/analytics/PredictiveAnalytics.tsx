import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Heart, AlertTriangle, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const healthTrendData = [
  { month: 'Jan', bloodPressure: 120, heartRate: 72, weight: 70 },
  { month: 'Feb', bloodPressure: 118, heartRate: 70, weight: 69.5 },
  { month: 'Mar', bloodPressure: 122, heartRate: 74, weight: 69.8 },
  { month: 'Apr', bloodPressure: 119, heartRate: 71, weight: 69.2 },
  { month: 'May', bloodPressure: 121, heartRate: 73, weight: 69.5 },
  { month: 'Jun', bloodPressure: 117, heartRate: 69, weight: 69.0 }
];

const riskFactors = [
  { name: 'Diet', value: 35, color: '#ef4444' },
  { name: 'Exercise', value: 25, color: '#f97316' }, 
  { name: 'Sleep', value: 20, color: '#eab308' },
  { name: 'Stress', value: 20, color: '#22c55e' }
];

export const PredictiveAnalytics = () => {
  const [healthScore, setHealthScore] = useState(78);
  const [predictions] = useState([
    {
      id: '1',
      type: 'cardiovascular',
      risk: 'low',
      probability: 15,
      description: 'Based on your current health metrics, you have a low risk of cardiovascular issues.',
      recommendations: ['Maintain regular exercise', 'Continue healthy diet', 'Monitor blood pressure']
    },
    {
      id: '2', 
      type: 'diabetes',
      risk: 'medium',
      probability: 35,
      description: 'Your family history and BMI indicate moderate diabetes risk.',
      recommendations: ['Reduce sugar intake', 'Increase physical activity', 'Regular blood sugar monitoring']
    }
  ]);

  const [healthGoals] = useState([
    { goal: 'Weight Loss', current: 69.5, target: 68, unit: 'kg', progress: 60 },
    { goal: 'Blood Pressure', current: 119, target: 115, unit: 'mmHg', progress: 75 },
    { goal: 'Exercise', current: 4, target: 5, unit: 'days/week', progress: 80 },
    { goal: 'Sleep', current: 7, target: 8, unit: 'hours', progress: 87 }
  ]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Health Score
          </CardTitle>
          <CardDescription>
            Your overall health rating based on various metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {Math.round(healthScore)}
              </div>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Health Trends
          </CardTitle>
          <CardDescription>
            Track your key health metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bloodPressure" stroke="#3b82f6" strokeWidth={2} name="Blood Pressure" />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} name="Weight" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Health Risk Predictions
          </CardTitle>
          <CardDescription>
            AI-powered predictions based on your health data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold capitalize">{prediction.type} Risk</h4>
                <Badge className={getRiskColor(prediction.risk)}>
                  {prediction.risk} risk ({prediction.probability}%)
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{prediction.description}</p>
              <div className="space-y-2">
                <p className="font-medium text-sm">Recommendations:</p>
                <ul className="list-disc list-inside space-y-1">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Health Goals Progress
          </CardTitle>
          <CardDescription>
            Track your progress towards health objectives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{goal.goal}</span>
                <span className="text-sm text-muted-foreground">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {goal.progress}% complete
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Health Alerts */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Health Reminder:</strong> It's been 3 days since your last workout. Consider scheduling some physical activity today for optimal health.
        </AlertDescription>
      </Alert>
    </div>
  );
};