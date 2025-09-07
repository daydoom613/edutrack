import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Eye, 
  MoreHorizontal,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock student data
const mockStudents = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@student.edu',
    studentId: 'STU001',
    grade: 'Grade 10',
    avatar: 'SJ',
    averageScore: 94,
    totalAttempts: 15,
    lastActivity: '2024-01-15',
    status: 'excellent',
    subjects: {
      math: 96,
      science: 92,
      english: 95,
      history: 93
    },
    riskLevel: 'low',
    engagement: 95
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@student.edu',
    studentId: 'STU002',
    grade: 'Grade 10',
    avatar: 'MC',
    averageScore: 91,
    totalAttempts: 18,
    lastActivity: '2024-01-14',
    status: 'excellent',
    subjects: {
      math: 98,
      science: 89,
      english: 88,
      history: 89
    },
    riskLevel: 'low',
    engagement: 92
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@student.edu',
    studentId: 'STU003',
    grade: 'Grade 9',
    avatar: 'ED',
    averageScore: 89,
    totalAttempts: 12,
    lastActivity: '2024-01-15',
    status: 'good',
    subjects: {
      math: 85,
      science: 92,
      english: 94,
      history: 85
    },
    riskLevel: 'low',
    engagement: 88
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@student.edu',
    studentId: 'STU004',
    grade: 'Grade 10',
    avatar: 'DW',
    averageScore: 87,
    totalAttempts: 16,
    lastActivity: '2024-01-13',
    status: 'good',
    subjects: {
      math: 90,
      science: 85,
      english: 88,
      history: 85
    },
    riskLevel: 'low',
    engagement: 85
  },
  {
    id: '5',
    name: 'Lisa Brown',
    email: 'lisa.brown@student.edu',
    studentId: 'STU005',
    grade: 'Grade 9',
    avatar: 'LB',
    averageScore: 85,
    totalAttempts: 14,
    lastActivity: '2024-01-12',
    status: 'good',
    subjects: {
      math: 88,
      science: 82,
      english: 87,
      history: 83
    },
    riskLevel: 'low',
    engagement: 82
  },
  {
    id: '6',
    name: 'Alex Thompson',
    email: 'alex.thompson@student.edu',
    studentId: 'STU006',
    grade: 'Grade 10',
    avatar: 'AT',
    averageScore: 58,
    totalAttempts: 8,
    lastActivity: '2024-01-10',
    status: 'at-risk',
    subjects: {
      math: 45,
      science: 62,
      english: 65,
      history: 60
    },
    riskLevel: 'high',
    engagement: 45
  },
  {
    id: '7',
    name: 'Maria Garcia',
    email: 'maria.garcia@student.edu',
    studentId: 'STU007',
    grade: 'Grade 9',
    avatar: 'MG',
    averageScore: 62,
    totalAttempts: 10,
    lastActivity: '2024-01-11',
    status: 'needs-improvement',
    subjects: {
      math: 55,
      science: 68,
      english: 70,
      history: 55
    },
    riskLevel: 'medium',
    engagement: 60
  },
  {
    id: '8',
    name: 'James Lee',
    email: 'james.lee@student.edu',
    studentId: 'STU008',
    grade: 'Grade 10',
    avatar: 'JL',
    averageScore: 65,
    totalAttempts: 12,
    lastActivity: '2024-01-14',
    status: 'needs-improvement',
    subjects: {
      math: 70,
      science: 60,
      english: 68,
      history: 62
    },
    riskLevel: 'medium',
    engagement: 65
  },
  {
    id: '9',
    name: 'Anna Smith',
    email: 'anna.smith@student.edu',
    studentId: 'STU009',
    grade: 'Grade 9',
    avatar: 'AS',
    averageScore: 59,
    totalAttempts: 6,
    lastActivity: '2024-01-08',
    status: 'at-risk',
    subjects: {
      math: 50,
      science: 65,
      english: 62,
      history: 58
    },
    riskLevel: 'high',
    engagement: 40
  },
  {
    id: '10',
    name: 'Ryan O\'Connor',
    email: 'ryan.oconnor@student.edu',
    studentId: 'STU010',
    grade: 'Grade 10',
    avatar: 'RO',
    averageScore: 78,
    totalAttempts: 13,
    lastActivity: '2024-01-15',
    status: 'good',
    subjects: {
      math: 82,
      science: 75,
      english: 80,
      history: 75
    },
    riskLevel: 'low',
    engagement: 78
  },
  {
    id: '11',
    name: 'Sophie Taylor',
    email: 'sophie.taylor@student.edu',
    studentId: 'STU011',
    grade: 'Grade 9',
    avatar: 'ST',
    averageScore: 92,
    totalAttempts: 17,
    lastActivity: '2024-01-15',
    status: 'excellent',
    subjects: {
      math: 95,
      science: 90,
      english: 91,
      history: 92
    },
    riskLevel: 'low',
    engagement: 94
  },
  {
    id: '12',
    name: 'Kevin Martinez',
    email: 'kevin.martinez@student.edu',
    studentId: 'STU012',
    grade: 'Grade 10',
    avatar: 'KM',
    averageScore: 73,
    totalAttempts: 11,
    lastActivity: '2024-01-12',
    status: 'good',
    subjects: {
      math: 78,
      science: 70,
      english: 75,
      history: 69
    },
    riskLevel: 'low',
    engagement: 72
  },
  {
    id: '13',
    name: 'Rachel Green',
    email: 'rachel.green@student.edu',
    studentId: 'STU013',
    grade: 'Grade 9',
    avatar: 'RG',
    averageScore: 88,
    totalAttempts: 15,
    lastActivity: '2024-01-14',
    status: 'good',
    subjects: {
      math: 85,
      science: 91,
      english: 89,
      history: 87
    },
    riskLevel: 'low',
    engagement: 86
  },
  {
    id: '14',
    name: 'Daniel Kim',
    email: 'daniel.kim@student.edu',
    studentId: 'STU014',
    grade: 'Grade 10',
    avatar: 'DK',
    averageScore: 81,
    totalAttempts: 14,
    lastActivity: '2024-01-13',
    status: 'good',
    subjects: {
      math: 88,
      science: 78,
      english: 82,
      history: 76
    },
    riskLevel: 'low',
    engagement: 79
  },
  {
    id: '15',
    name: 'Olivia White',
    email: 'olivia.white@student.edu',
    studentId: 'STU015',
    grade: 'Grade 9',
    avatar: 'OW',
    averageScore: 76,
    totalAttempts: 9,
    lastActivity: '2024-01-11',
    status: 'needs-improvement',
    subjects: {
      math: 72,
      science: 80,
      english: 78,
      history: 74
    },
    riskLevel: 'medium',
    engagement: 68
  }
];

export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = mockStudents.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort students
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'score':
          aValue = a.averageScore;
          bValue = b.averageScore;
          break;
        case 'attempts':
          aValue = a.totalAttempts;
          bValue = b.totalAttempts;
          break;
        case 'lastActivity':
          aValue = new Date(a.lastActivity);
          bValue = new Date(b.lastActivity);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, subjectFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'good': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'needs-improvement': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'at-risk': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredAndSortedStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const stats = useMemo(() => {
    const total = mockStudents.length;
    const excellent = mockStudents.filter(s => s.status === 'excellent').length;
    const good = mockStudents.filter(s => s.status === 'good').length;
    const needsImprovement = mockStudents.filter(s => s.status === 'needs-improvement').length;
    const atRisk = mockStudents.filter(s => s.status === 'at-risk').length;
    const averageScore = Math.round(mockStudents.reduce((sum, s) => sum + s.averageScore, 0) / total);

    return { total, excellent, good, needsImprovement, atRisk, averageScore };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage and track student performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Mail className="w-4 h-4" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-education-blue/10 rounded-lg">
                <Users className="w-5 h-5 text-education-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.excellent}</div>
                <div className="text-sm text-muted-foreground">Excellent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.good}</div>
                <div className="text-sm text-muted-foreground">Good</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.needsImprovement}</div>
                <div className="text-sm text-muted-foreground">Needs Help</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.atRisk}</div>
                <div className="text-sm text-muted-foreground">At Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search students by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="needs-improvement">Needs Help</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="attempts">Attempts</SelectItem>
                  <SelectItem value="lastActivity">Last Activity</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student List</CardTitle>
              <CardDescription>
                {filteredAndSortedStudents.length} of {mockStudents.length} students
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedStudents.length === filteredAndSortedStudents.length && filteredAndSortedStudents.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 w-12"></th>
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Performance</th>
                  <th className="text-left py-3 px-4">Subject Scores</th>
                  <th className="text-left py-3 px-4">Activity</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-education-blue/10 rounded-full flex items-center justify-center text-sm font-bold">
                          {student.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                          <div className="text-xs text-muted-foreground">{student.studentId} • {student.grade}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getPerformanceIcon(student.status)}
                          <span className="font-medium">{student.averageScore}%</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.totalAttempts} attempts
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="flex justify-between">
                          <span>Math:</span>
                          <span className="font-medium">{student.subjects.math}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Science:</span>
                          <span className="font-medium">{student.subjects.science}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>English:</span>
                          <span className="font-medium">{student.subjects.english}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>History:</span>
                          <span className="font-medium">{student.subjects.history}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{new Date(student.lastActivity).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          {student.engagement}% engagement
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status.replace('-', ' ')}
                        </Badge>
                        <div className={`text-xs ${getRiskColor(student.riskLevel)}`}>
                          {student.riskLevel} risk
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            View Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
