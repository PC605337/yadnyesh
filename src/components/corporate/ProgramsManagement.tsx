import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Activity, Users, Calendar, Target, TrendingUp, Heart, Brain, Dumbbell } from "lucide-react";

interface WellnessProgram {
  id: string;
  name: string;
  description: string;
  category: "fitness" | "mental-health" | "nutrition" | "preventive-care";
  status: "active" | "inactive" | "draft";
  enrolledCount: number;
  capacity: number;
  startDate: string;
  endDate: string;
  instructor: string;
  cost: number;
  completionRate: number;
  rating: number;
}

export function ProgramsManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<WellnessProgram | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [programs] = useState<WellnessProgram[]>([
    {
      id: "1",
      name: "Stress Management Workshop",
      description: "Learn effective techniques to manage workplace stress and improve mental well-being.",
      category: "mental-health",
      status: "active",
      enrolledCount: 45,
      capacity: 50,
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      instructor: "Dr. Sarah Johnson",
      cost: 5000,
      completionRate: 78,
      rating: 4.6
    },
    {
      id: "2",
      name: "Corporate Fitness Challenge",
      description: "A 12-week fitness program designed to improve overall health and team bonding.",
      category: "fitness",
      status: "active",
      enrolledCount: 120,
      capacity: 150,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      instructor: "Mike Davis",
      cost: 8000,
      completionRate: 65,
      rating: 4.4
    },
    {
      id: "3",
      name: "Nutrition and Healthy Eating",
      description: "Learn about balanced nutrition and meal planning for busy professionals.",
      category: "nutrition",
      status: "active",
      enrolledCount: 35,
      capacity: 40,
      startDate: "2024-02-01",
      endDate: "2024-04-01",
      instructor: "Nutritionist Priya Sharma",
      cost: 3500,
      completionRate: 82,
      rating: 4.8
    },
    {
      id: "4",
      name: "Annual Health Screening",
      description: "Comprehensive health checkup including blood tests, vitals, and consultations.",
      category: "preventive-care",
      status: "active",
      enrolledCount: 200,
      capacity: 250,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      instructor: "Healthcare Team",
      cost: 15000,
      completionRate: 45,
      rating: 4.9
    },
    {
      id: "5",
      name: "Mindfulness Meditation",
      description: "Daily meditation sessions to improve focus and reduce anxiety.",
      category: "mental-health",
      status: "draft",
      enrolledCount: 0,
      capacity: 30,
      startDate: "2024-03-01",
      endDate: "2024-05-01",
      instructor: "Meditation Expert",
      cost: 2500,
      completionRate: 0,
      rating: 0
    }
  ]);

  const categories = ["all", "fitness", "mental-health", "nutrition", "preventive-care"];
  const statuses = ["all", "active", "inactive", "draft"];
  
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || program.category === filterCategory;
    const matchesStatus = filterStatus === "all" || program.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fitness":
        return <Dumbbell className="w-4 h-4" />;
      case "mental-health":
        return <Brain className="w-4 h-4" />;
      case "nutrition":
        return <Heart className="w-4 h-4" />;
      case "preventive-care":
        return <Activity className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      fitness: "bg-blue-100 text-blue-800",
      "mental-health": "bg-purple-100 text-purple-800",
      nutrition: "bg-green-100 text-green-800",
      "preventive-care": "bg-orange-100 text-orange-800"
    };
    return (
      <Badge className={colors[category as keyof typeof colors]}>
        {getCategoryIcon(category)}
        <span className="ml-1">{category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleProgramAction = (programId: string, action: "activate" | "deactivate" | "duplicate") => {
    toast({
      title: `Program ${action}d`,
      description: `Program has been ${action}d successfully.`,
    });
  };

  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.status === "active").length;
  const totalEnrollments = programs.reduce((sum, p) => sum + p.enrolledCount, 0);
  const avgCompletionRate = Math.round(programs.reduce((sum, p) => sum + p.completionRate, 0) / totalPrograms);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Programs Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">Import Programs</Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Program
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Programs</p>
                <p className="text-2xl font-bold">{totalPrograms}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Programs</p>
                <p className="text-2xl font-bold text-green-600">{activePrograms}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-bold">{totalEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
                <p className="text-2xl font-bold">{avgCompletionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs by name, description, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Programs List */}
      <div className="grid gap-4">
        {filteredPrograms.map((program) => (
          <Card key={program.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{program.name}</h3>
                    {getCategoryBadge(program.category)}
                    {getStatusBadge(program.status)}
                  </div>
                  <p className="text-muted-foreground mb-4">{program.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Instructor</Label>
                      <p className="font-medium">{program.instructor}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Duration</Label>
                      <p className="font-medium">
                        {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Enrollment</Label>
                      <p className="font-medium">{program.enrolledCount}/{program.capacity}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Cost</Label>
                      <p className="font-medium">₹{program.cost.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Enrollment Progress</span>
                      <span>{Math.round((program.enrolledCount / program.capacity) * 100)}%</span>
                    </div>
                    <Progress value={(program.enrolledCount / program.capacity) * 100} className="h-2" />
                  </div>

                  {program.completionRate > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>{program.completionRate}%</span>
                      </div>
                      <Progress value={program.completionRate} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleProgramAction(program.id, "duplicate")}
                  >
                    Duplicate
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedProgram(program)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Program Details</DialogTitle>
                      </DialogHeader>
                      {selectedProgram && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Program Name</Label>
                              <p className="font-medium">{selectedProgram.name}</p>
                            </div>
                            <div>
                              <Label>Category</Label>
                              <div className="mt-1">{getCategoryBadge(selectedProgram.category)}</div>
                            </div>
                            <div>
                              <Label>Instructor</Label>
                              <p className="font-medium">{selectedProgram.instructor}</p>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <div className="mt-1">{getStatusBadge(selectedProgram.status)}</div>
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <p className="font-medium">{new Date(selectedProgram.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <p className="font-medium">{new Date(selectedProgram.endDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Label>Cost</Label>
                              <p className="font-medium">₹{selectedProgram.cost.toLocaleString()}</p>
                            </div>
                            <div>
                              <Label>Rating</Label>
                              <p className="font-medium">{selectedProgram.rating > 0 ? `${selectedProgram.rating}/5` : "No ratings yet"}</p>
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <p className="text-muted-foreground mt-1">{selectedProgram.description}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Enrolled</Label>
                              <p className="text-2xl font-bold">{selectedProgram.enrolledCount}</p>
                            </div>
                            <div>
                              <Label>Capacity</Label>
                              <p className="text-2xl font-bold">{selectedProgram.capacity}</p>
                            </div>
                            <div>
                              <Label>Completion Rate</Label>
                              <p className="text-2xl font-bold">{selectedProgram.completionRate}%</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">Edit Program</Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleProgramAction(selectedProgram.id, selectedProgram.status === "active" ? "deactivate" : "activate")}
                            >
                              {selectedProgram.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                            <Button variant="outline" size="sm">View Participants</Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}