import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Shield, User, UserCheck, UserX, Mail, Calendar, MapPin } from "lucide-react";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "patient" | "provider" | "corporate";
  status: "active" | "inactive" | "suspended";
  joinedDate: string;
  lastLogin: string;
  location?: string;
  avatar?: string;
  phoneNumber?: string;
  totalAppointments?: number;
  verified: boolean;
}

export function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [users] = useState<SystemUser[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@healthcare.com",
      role: "admin",
      status: "active",
      joinedDate: "2023-01-01",
      lastLogin: "2024-01-15T10:30:00Z",
      location: "Mumbai, Maharashtra",
      phoneNumber: "+91 98765 43210",
      verified: true
    },
    {
      id: "2",
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@healthcare.com",
      role: "provider",
      status: "active",
      joinedDate: "2023-01-15",
      lastLogin: "2024-01-15T09:15:00Z",
      location: "Mumbai, Maharashtra",
      phoneNumber: "+91 98765 43211",
      totalAppointments: 1250,
      verified: true
    },
    {
      id: "3",
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      role: "patient",
      status: "active",
      joinedDate: "2023-03-20",
      lastLogin: "2024-01-14T14:20:00Z",
      location: "Delhi, Delhi",
      phoneNumber: "+91 98765 43212",
      totalAppointments: 15,
      verified: true
    },
    {
      id: "4",
      name: "TechCorp Ltd",
      email: "hr@techcorp.com",
      role: "corporate",
      status: "active",
      joinedDate: "2023-06-10",
      lastLogin: "2024-01-13T11:45:00Z",
      location: "Bangalore, Karnataka",
      phoneNumber: "+91 98765 43213",
      verified: true
    },
    {
      id: "5",
      name: "Amit Patel",
      email: "amit.patel@gmail.com",
      role: "patient",
      status: "inactive",
      joinedDate: "2023-08-12",
      lastLogin: "2023-12-20T16:30:00Z",
      location: "Pune, Maharashtra",
      phoneNumber: "+91 98765 43214",
      totalAppointments: 3,
      verified: false
    },
    {
      id: "6",
      name: "Dr. Sneha Reddy",
      email: "sneha.reddy@healthcare.com",
      role: "provider",
      status: "suspended",
      joinedDate: "2023-09-05",
      lastLogin: "2024-01-10T08:20:00Z",
      location: "Hyderabad, Telangana",
      phoneNumber: "+91 98765 43215",
      totalAppointments: 875,
      verified: true
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (userId: string, action: "activate" | "deactivate" | "suspend" | "verify") => {
    toast({
      title: `User ${action}d`,
      description: `User has been ${action}d successfully.`,
    });
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      provider: "bg-blue-100 text-blue-800", 
      patient: "bg-green-100 text-green-800",
      corporate: "bg-orange-100 text-orange-800"
    };
    const icons = {
      admin: Shield,
      provider: UserCheck,
      patient: User,
      corporate: UserX
    };
    const Icon = icons[role as keyof typeof icons];
    return (
      <Badge className={colors[role as keyof typeof colors]}>
        <Icon className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive": 
        return <Badge variant="secondary">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const inactiveUsers = users.filter(u => u.status === "inactive").length;
  const suspendedUsers = users.filter(u => u.status === "suspended").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Users</Button>
          <Button>Add User</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{suspendedUsers}</p>
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
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                        {user.verified && <Badge variant="outline" className="text-xs">Verified</Badge>}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        {user.location && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.location}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {new Date(user.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                      {user.totalAppointments && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {user.totalAppointments} appointments
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Name</Label>
                                <p className="font-medium">{selectedUser.name}</p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p className="font-medium">{selectedUser.email}</p>
                              </div>
                              <div>
                                <Label>Role</Label>
                                <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <p className="font-medium">{selectedUser.phoneNumber || "Not provided"}</p>
                              </div>
                              <div>
                                <Label>Location</Label>
                                <p className="font-medium">{selectedUser.location || "Not provided"}</p>
                              </div>
                              <div>
                                <Label>Joined Date</Label>
                                <p className="font-medium">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label>Last Login</Label>
                                <p className="font-medium">{new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleUserAction(selectedUser.id, "activate")}
                                disabled={selectedUser.status === "active"}
                              >
                                Activate
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserAction(selectedUser.id, "deactivate")}
                                disabled={selectedUser.status === "inactive"}
                              >
                                Deactivate
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleUserAction(selectedUser.id, "suspend")}
                                disabled={selectedUser.status === "suspended"}
                              >
                                Suspend
                              </Button>
                              {!selectedUser.verified && (
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUserAction(selectedUser.id, "verify")}
                                >
                                  Verify
                                </Button>
                              )}
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