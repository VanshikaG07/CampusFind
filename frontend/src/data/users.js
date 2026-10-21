// Mock users data - realistic Indian college student names
export const mockUsers = [
  {
    id: 1,
    name: 'Arjun Sharma',
    email: 'arjun.sharma@college.edu',
    phone: '9876543210',
    avatar: null,
    college: 'Delhi Skill and Entrepreneurship University',
    department: 'Computer Science',
    year: '3rd Year',
    member_since: '2025-08-01T10:00:00',
    bio: 'CSE student, interested in coding and tech. Selling old books and electronics.',
  },
  {
    id: 2,
    name: 'Priya Verma',
    email: 'priya.verma@college.edu',
    phone: '9812345678',
    avatar: null,
    college: 'Delhi Skill and Entrepreneurship University',
    department: 'Electronics & Communication',
    year: '2nd Year',
    member_since: '2025-09-15T10:00:00',
    bio: 'ECE student. Love cycling and sports. Looking for lab equipment.',
  },
  {
    id: 3,
    name: 'Rahul Gupta',
    email: 'rahul.gupta@college.edu',
    phone: '9845612345',
    avatar: null,
    college: 'Delhi Skill and Entrepreneurship University',
    department: 'Mechanical Engineering',
    year: '4th Year',
    member_since: '2025-07-20T10:00:00',
    bio: 'Final year ME student. Selling stuff before graduation.',
  },
  {
    id: 4,
    name: 'Sneha Patel',
    email: 'sneha.patel@college.edu',
    phone: '9923456781',
    avatar: null,
    college: 'Delhi Skill and Entrepreneurship University',
    department: 'Information Technology',
    year: '1st Year',
    member_since: '2026-08-10T10:00:00',
    bio: 'Freshie! Looking for second-hand textbooks and hostel essentials.',
  },
  {
    id: 5,
    name: 'Karan Mehta',
    email: 'karan.mehta@college.edu',
    phone: '9867891234',
    avatar: null,
    college: 'Delhi Skill and Entrepreneurship University',
    department: 'Civil Engineering',
    year: '3rd Year',
    member_since: '2025-08-25T10:00:00',
    bio: 'Civil Engg student. Sports enthusiast. Have a cycle for rent.',
  },
  {
    id: 6,
    name: 'Ananya Singh',
    email: 'ananya.singh@college.edu',
    phone: '9934567812',
    avatar: null,
    college: 'Delhi Skill and Entrepreneurship University',
    department: 'Computer Science',
    year: '2nd Year',
    member_since: '2025-09-01T10:00:00',
    bio: 'CSE sophomore. Part of the coding club. Selling last year\'s books.',
  },
];

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
