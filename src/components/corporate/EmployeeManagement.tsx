import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, UserPlus, Activity, Heart, Mail, Phone, Calendar, MapPin, Briefcase } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  healthScore: number;
  programsEnrolled: number;
  lastCheckup: string;
  status: "active" | "inactive";
  phone: string;
  joinedDate: string;
  avatar?: string;
  emergencyContact?: string;
  healthRisk: "low" | "medium" | "high";
}

export function EmployeeManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  
  const [employees] = useState<Employee[]>([
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul.sharma@techcorp.com",
      department: "Engineering",
      position: "Senior Developer",
      healthScore: 85,
      programsEnrolled: 3,
      lastCheckup: "2024-01-10",
      status: "active",
      phone: "+91 98765 43210",
      joinedDate: "2022-03-15",
      emergencyContact: "+91 98765 43211",
      healthRisk: "low"
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya.patel@techcorp.com",
      department: "HR",
      position: "HR Manager",
      healthScore: 92,
      programsEnrolled: 5,
      lastCheckup: "2024-01-08",
      status: "active",
      phone: "+91 98765 43212",
      joinedDate: "2021-07-20",
      emergencyContact: "+91 98765 43213",
      healthRisk: "low"
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit.kumar@techcorp.com",
      department: "Sales",
      position: "Sales Executive",
      healthScore: 68,
      programsEnrolled: 1,
      lastCheckup: "2023-11-15",
      status: "active",
      phone: "+91 98765 43214",
      joinedDate: "2023-01-10",
      emergencyContact: "+91 98765 43215",
      healthRisk: "medium"
    },
    {
      id: "4",
      name: "Sneha Reddy",
      email: "sneha.reddy@techcorp.com",
      department: "Marketing",
      position: "Marketing Manager",
      healthScore: 78,
      programsEnrolled: 4,
      lastCheckup: "2024-01-05",
      status: "active",
      phone: "+91 98765 43216",
      joinedDate: "2022-09-12",
      emergencyContact: "+91 98765 43217",
      healthRisk: "low"
    },
    {
      id: "5",
      name: "Vikram Singh",
      email: "vikram.singh@techcorp.com",
      department: "Finance",
      position: "Finance Analyst",
      healthScore: 45,
      programsEnrolled: 0,
      lastCheckup: "2023-08-20",
      status: "inactive",
      phone: "+91 98765 43218",
      joinedDate: "2023-05-18",
      emergencyContact: "+91 98765 43219",
      healthRisk: "high"
    }
  ]);

  const departments = ["all", "Engineering", "HR", "Sales", "Marketing", "Finance"];
  
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getHealthScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleInviteToProgram = (employeeId: string) => {
    toast({
      title: "Invitation Sent",
      description: "Employee has been invited to join wellness programs.",
    });
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "active").length;
  const avgHealthScore = Math.round(employees.reduce((sum, e) => sum + e.healthScore, 0) / totalEmployees);
  const totalEnrollments = employees.reduce((sum, e) => sum + e.programsEnrolled, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Health Score</p>
                <p className="text-2xl font-bold">{avgHealthScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Program Enrollments</p>
                <p className="text-2xl font-bold">{totalEnrollments}</p>
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
            placeholder="Search employees by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employee List */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="p-4 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{employee.name}</h3>
                        {getHealthScoreBadge(employee.healthScore)}
                        {getRiskBadge(employee.healthRisk)}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {employee.email}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {employee.department} - {employee.position}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          Health Score: {employee.healthScore}/100
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Programs: {employee.programsEnrolled}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Last Checkup: {new Date(employee.lastCheckup).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleInviteToProgram(employee.id)}
                    >
                      Invite to Programs
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Employee Details</DialogTitle>
                        </DialogHeader>
                        {selectedEmployee && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Name</Label>
                                <p className="font-medium">{selectedEmployee.name}</p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p className="font-medium">{selectedEmployee.email}</p>
                              </div>
                              <div>
                                <Label>Department</Label>
                                <p className="font-medium">{selectedEmployee.department}</p>
                              </div>
                              <div>
                                <Label>Position</Label>
                                <p className="font-medium">{selectedEmployee.position}</p>
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <p className="font-medium">{selectedEmployee.phone}</p>
                              </div>
                              <div>
                                <Label>Emergency Contact</Label>
                                <p className="font-medium">{selectedEmployee.emergencyContact}</p>
                              </div>
                              <div>
                                <Label>Joined Date</Label>
                                <p className="font-medium">{new Date(selectedEmployee.joinedDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label>Last Checkup</Label>
                                <p className="font-medium">{new Date(selectedEmployee.lastCheckup).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Health Score</Label>
                                <div className="mt-1">{getHealthScoreBadge(selectedEmployee.healthScore)}</div>
                              </div>
                              <div>
                                <Label>Risk Level</Label>
                                <div className="mt-1">{getRiskBadge(selectedEmployee.healthRisk)}</div>
                              </div>
                              <div>
                                <Label>Programs Enrolled</Label>
                                <p className="font-medium text-2xl">{selectedEmployee.programsEnrolled}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm">Schedule Checkup</Button>
                              <Button variant="outline" size="sm">Send Health Tips</Button>
                              <Button variant="outline" size="sm">View Health Records</Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}