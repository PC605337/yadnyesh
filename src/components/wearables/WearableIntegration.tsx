import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Watch, 
  Heart, 
  Activity, 
  Footprints,
  Moon,
  Thermometer,
  Droplets,
  Zap,
  Bluetooth,
  BluetoothConnected,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Settings,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'heart_monitor' | 'sleep_tracker';
  brand: string;
  model: string;
  connected: boolean;
  battery: number;
  lastSync: Date;
}

interface HealthMetric {
  type: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
  target?: number;
  range?: { min: number; max: number };
}

interface HealthData {
  timestamp: Date;
  heartRate: number;
  steps: number;
  sleepHours: number;
  calories: number;
  temperature: number;
  oxygenSaturation: number;
}

export function WearableIntegration() {
  const [devices, setDevices] = useState<WearableDevice[]>([
    {
      id: '1',
      name: 'Apple Watch Series 9',
      type: 'smartwatch',
      brand: 'Apple',
      model: 'Series 9',
      connected: true,
      battery: 85,
      lastSync: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: '2',
      name: 'Fitbit Charge 6',
      type: 'fitness_tracker',
      brand: 'Fitbit',
      model: 'Charge 6',
      connected: false,
      battery: 42,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ]);

  const [currentMetrics, setCurrentMetrics] = useState<HealthMetric[]>([
    {
      type: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      trend: 'stable',
      lastUpdated: new Date(),
      range: { min: 60, max: 100 }
    },
    {
      type: 'Steps',
      value: 8450,
      unit: 'steps',
      trend: 'up',
      lastUpdated: new Date(),
      target: 10000
    },
    {
      type: 'Sleep',
      value: 7.5,
      unit: 'hours',
      trend: 'down',
      lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000),
      target: 8
    },
    {
      type: 'Calories',
      value: 1850,
      unit: 'cal',
      trend: 'up',
      lastUpdated: new Date(),
      target: 2200
    },
    {
      type: 'Body Temperature',
      value: 98.6,
      unit: '°F',
      trend: 'stable',
      lastUpdated: new Date(),
      range: { min: 97, max: 99 }
    },
    {
      type: 'Blood Oxygen',
      value: 98,
      unit: '%',
      trend: 'stable',
      lastUpdated: new Date(),
      range: { min: 95, max: 100 }
    }
  ]);

  const [historicalData, setHistoricalData] = useState<HealthData[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  useEffect(() => {
    // Generate mock historical data
    const generateHistoricalData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(now.getHours() - i * 4);
        
        data.push({
          timestamp: date,
          heartRate: 65 + Math.random() * 20,
          steps: Math.floor(1000 + Math.random() * 2000),
          sleepHours: i > 4 ? 0 : 6 + Math.random() * 3,
          calories: Math.floor(200 + Math.random() * 400),
          temperature: 97.5 + Math.random() * 2,
          oxygenSaturation: 96 + Math.random() * 4
        });
      }
      
      return data;
    };

    setHistoricalData(generateHistoricalData());
  }, []);

  const connectDevice = async (deviceId: string) => {
    setIsScanning(true);
    
    // Simulate connection process
    setTimeout(() => {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true, lastSync: new Date() }
          : device
      ));
      setIsScanning(false);
    }, 2000);
  };

  const disconnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: false }
        : device
    ));
  };

  const syncData = async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, lastSync: new Date() }
        : device
    ));
    
    // Simulate new data sync
    setCurrentMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.type === 'Heart Rate' 
        ? 68 + Math.random() * 15 
        : metric.type === 'Steps'
        ? Math.floor(metric.value + Math.random() * 500)
        : metric.value,
      lastUpdated: new Date()
    })));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'Heart Rate': return <Heart className="h-4 w-4 text-red-500" />;
      case 'Steps': return <Footprints className="h-4 w-4 text-blue-500" />;
      case 'Sleep': return <Moon className="h-4 w-4 text-purple-500" />;
      case 'Calories': return <Zap className="h-4 w-4 text-orange-500" />;
      case 'Body Temperature': return <Thermometer className="h-4 w-4 text-yellow-500" />;
      case 'Blood Oxygen': return <Droplets className="h-4 w-4 text-cyan-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "text-green-500";
    if (battery > 20) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Watch className="h-5 w-5" />
            Connected Devices
          </CardTitle>
          <CardDescription>
            Manage your wearable devices and health trackers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => (
              <Card key={device.id} className={`border-2 ${device.connected ? 'border-green-200' : 'border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {device.connected ? (
                        <BluetoothConnected className="h-6 w-6 text-blue-500" />
                      ) : (
                        <Bluetooth className="h-6 w-6 text-muted-foreground" />
                      )}
                      <div>
                        <h3 className="font-semibold">{device.name}</h3>
                        <p className="text-sm text-muted-foreground">{device.brand} {device.model}</p>
                      </div>
                    </div>
                    <Badge variant={device.connected ? 'default' : 'secondary'}>
                      {device.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Battery</span>
                      <div className="flex items-center gap-2">
                        <Progress value={device.battery} className="w-16" />
                        <span className={`text-sm font-medium ${getBatteryColor(device.battery)}`}>
                          {device.battery}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Sync</span>
                      <span className="text-sm text-muted-foreground">
                        {device.lastSync.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {device.connected ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => syncData(device.id)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Sync
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => disconnectDevice(device.id)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => connectDevice(device.id)}
                          disabled={isScanning}
                        >
                          {isScanning ? (
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Bluetooth className="h-3 w-3 mr-1" />
                          )}
                          Connect
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Health Metrics</CardTitle>
          <CardDescription>
            Live data from your connected devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {currentMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getMetricIcon(metric.type)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.unit}</p>
                  <p className="text-xs font-medium">{metric.type}</p>
                  
                  {metric.target && (
                    <div className="mt-2">
                      <Progress 
                        value={(metric.value / metric.target) * 100} 
                        className="h-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Goal: {metric.target} {metric.unit}
                      </p>
                    </div>
                  )}
                  
                  {metric.range && (
                    <div className="mt-2">
                      <div className={`text-xs px-2 py-1 rounded ${
                        metric.value >= metric.range.min && metric.value <= metric.range.max
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {metric.value >= metric.range.min && metric.value <= metric.range.max
                          ? 'Normal'
                          : 'Check Range'
                        }
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Data Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Health Trends (24 Hours)</CardTitle>
          <CardDescription>
            Track your health metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(time) => new Date(time).toLocaleString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Heart Rate (bpm)"
                />
                <Line 
                  type="monotone" 
                  dataKey="oxygenSaturation" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Blood Oxygen (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  name="Temperature (°F)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Health Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Step Goal Behind Schedule</p>
                <p className="text-sm text-yellow-700">
                  You're 15% behind your daily step goal. Consider taking a walk after lunch.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Heart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Excellent Heart Rate Variability</p>
                <p className="text-sm text-blue-700">
                  Your HRV indicates good recovery. Great job maintaining your fitness routine!
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Moon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Sleep Quality Improving</p>
                <p className="text-sm text-green-700">
                  Your sleep duration has increased by 12% this week. Keep up the good bedtime routine!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}