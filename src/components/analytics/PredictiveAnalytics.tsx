import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Brain,
  Activity,
  Shield,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Eye,
  Stethoscope
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface RiskPrediction {
  condition: string;
  riskLevel: 'low' | 'moderate' | 'high';
  probability: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
  icon: React.ComponentType<any>;
}

interface HealthTrend {
  metric: string;
  current: number;
  trend: 'improving' | 'declining' | 'stable';
  prediction: number;
  timeline: string;
  confidence: number;
}

interface BiometricPrediction {
  date: string;
  heartRate: number;
  bloodPressure: number;
  weight: number;
  bmi: number;
  bloodSugar: number;
}

export function PredictiveAnalytics() {
  const [riskPredictions, setRiskPredictions] = useState<RiskPrediction[]>([
    {
      condition: 'Cardiovascular Disease',
      riskLevel: 'moderate',
      probability: 23,
      timeframe: '10 years',
      factors: ['Family history', 'Sedentary lifestyle', 'Elevated cholesterol'],
      recommendations: ['Increase cardio exercise', 'Reduce sodium intake', 'Regular BP monitoring'],
      icon: Heart
    },
    {
      condition: 'Type 2 Diabetes',
      riskLevel: 'low',
      probability: 8,
      timeframe: '5 years',
      factors: ['Normal BMI', 'Good glucose control', 'Active lifestyle'],
      recommendations: ['Maintain current diet', 'Continue regular exercise', 'Annual screenings'],
      icon: Activity
    },
    {
      condition: 'Hypertension',
      riskLevel: 'moderate',
      probability: 31,
      timeframe: '5 years',
      factors: ['Age factor', 'Stress levels', 'Salt intake'],
      recommendations: ['Stress management', 'Reduce sodium', 'Monitor BP weekly'],
      icon: Stethoscope
    },
    {
      condition: 'Mental Health Issues',
      riskLevel: 'low',
      probability: 12,
      timeframe: '2 years',
      factors: ['Good social support', 'Regular sleep', 'Exercise routine'],
      recommendations: ['Maintain social connections', 'Practice mindfulness', 'Regular check-ins'],
      icon: Brain
    }
  ]);

  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([
    {
      metric: 'Cardiovascular Fitness',
      current: 78,
      trend: 'improving',
      prediction: 82,
      timeline: '3 months',
      confidence: 87
    },
    {
      metric: 'Body Weight',
      current: 165,
      trend: 'stable',
      prediction: 163,
      timeline: '6 months',
      confidence: 92
    },
    {
      metric: 'Sleep Quality',
      current: 7.2,
      trend: 'improving',
      prediction: 7.8,
      timeline: '1 month',
      confidence: 89
    },
    {
      metric: 'Stress Levels',
      current: 4.1,
      trend: 'declining',
      prediction: 3.2,
      timeline: '2 months',
      confidence: 85
    }
  ]);

  const [biometricPredictions, setBiometricPredictions] = useState<BiometricPrediction[]>([]);

  useEffect(() => {
    // Generate predictive biometric data
    const generatePredictions = () => {
      const data = [];
      const startDate = new Date();
      
      for (let i = 0; i < 12; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        
        // Simulate predictive trends
        const baseHR = 72;
        const baseBP = 120;
        const baseWeight = 165;
        const baseBMI = 24.5;
        const baseBS = 85;
        
        data.push({
          date: date.toLocaleDateString(),
          heartRate: Math.round(baseHR + Math.sin(i * 0.5) * 3 + (Math.random() - 0.5) * 4),
          bloodPressure: Math.round(baseBP - i * 0.5 + (Math.random() - 0.5) * 8),
          weight: Math.round((baseWeight - i * 0.3 + (Math.random() - 0.5) * 2) * 10) / 10,
          bmi: Math.round((baseBMI - i * 0.02 + (Math.random() - 0.5) * 0.3) * 10) / 10,
          bloodSugar: Math.round(baseBS + Math.sin(i * 0.3) * 5 + (Math.random() - 0.5) * 6)
        });
      }
      
      return data;
    };

    setBiometricPredictions(generatePredictions());
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  const riskDistributionData = [
    { name: 'Low Risk', value: 3, color: '#10b981' },
    { name: 'Moderate Risk', value: 2, color: '#f59e0b' },
    { name: 'High Risk', value: 0, color: '#ef4444' }
  ];

  const healthScoreData = [
    { subject: 'Cardiovascular', current: 78, optimal: 90 },
    { subject: 'Mental Health', current: 85, optimal: 90 },
    { subject: 'Nutrition', current: 72, optimal: 90 },
    { subject: 'Sleep', current: 68, optimal: 90 },
    { subject: 'Exercise', current: 82, optimal: 90 },
    { subject: 'Preventive Care', current: 75, optimal: 90 }
  ];

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Health Score & Predictions
          </CardTitle>
          <CardDescription>
            Comprehensive health analysis with AI-powered predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">82</div>
              <p className="text-sm text-muted-foreground">Overall Health Score</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+5 from last month</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
              <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
              <p className="text-xs text-muted-foreground mt-2">Based on 12 months of data</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
              <p className="text-sm text-muted-foreground">Active Recommendations</p>
              <p className="text-xs text-muted-foreground mt-2">AI-generated insights</p>
            </div>
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
            AI-powered risk assessment based on your health data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskPredictions.map((prediction, index) => {
              const IconComponent = prediction.icon;
              return (
                <Card key={index} className={`border-2 ${getRiskColor(prediction.riskLevel)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <h3 className="font-semibold">{prediction.condition}</h3>
                      </div>
                      <Badge variant={prediction.riskLevel === 'high' ? 'destructive' : prediction.riskLevel === 'moderate' ? 'default' : 'secondary'}>
                        {prediction.riskLevel} risk
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Risk Probability</span>
                          <span className="text-sm font-medium">{prediction.probability}%</span>
                        </div>
                        <Progress value={prediction.probability} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">over {prediction.timeframe}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Key Risk Factors:</p>
                        <div className="flex flex-wrap gap-1">
                          {prediction.factors.map((factor, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Recommendations:</p>
                        <ul className="text-xs space-y-1">
                          {prediction.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-600">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Health Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Health Trend Analysis
          </CardTitle>
          <CardDescription>
            Predicted health metric changes based on current patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthTrends.map((trend, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{trend.metric}</h3>
                    {getTrendIcon(trend.trend)}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Current</span>
                      <span className="font-medium">{trend.current}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Predicted ({trend.timeline})</span>
                      <span className="font-medium text-primary">{trend.prediction}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Confidence</span>
                        <span className="text-sm font-medium">{trend.confidence}%</span>
                      </div>
                      <Progress value={trend.confidence} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biometric Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              12-Month Health Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={biometricPredictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Heart Rate (bpm)"
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Weight (lbs)"
                    strokeDasharray="5 5"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Health Score Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Health Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={healthScoreData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar 
                    name="Current" 
                    dataKey="current" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                  <Radar 
                    name="Optimal" 
                    dataKey="optimal" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.1}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on predictive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Opportunity Detected</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your cardiovascular fitness shows strong improvement potential. Based on current trends, 
                    increasing cardio by 15 minutes daily could improve your fitness score by 8 points in 3 months.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Prevention Focus</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your current lifestyle patterns suggest a 67% reduction in cardiovascular disease risk 
                    compared to your age group. Maintain current exercise routine and consider adding omega-3 supplements.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Pattern Recognition</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Analysis shows your stress levels correlate with sleep quality. Implementing a consistent 
                    bedtime routine could improve both metrics by 15% within 4 weeks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}